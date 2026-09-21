import fs from 'fs';
import fsp from 'fs/promises';
import crypto from 'crypto';
import { Readable } from 'stream';

const MAGIC = Buffer.from('CAB2');
const HEADER_SIZE = 28;
const TAG_SIZE = 16;
const LEGACY_IV_SIZE = 16;
const DEFAULT_CHUNK_SIZE = 1024 * 1024;

export function deriveKey(secret) {
  if (/^[0-9a-fA-F]{64}$/.test(secret)) return Buffer.from(secret, 'hex');
  return crypto.createHash('sha256').update(secret).digest();
}

const legacyKey = (secret) => crypto.createHash('sha256').update(secret).digest();

const nonceForChunk = (baseNonce, index) => {
  if (index > 0xffffffff) throw new Error('File is too large for encryption nonce space');
  const nonce = Buffer.from(baseNonce);
  nonce.writeUInt32BE(index, 8);
  return nonce;
};

const aadForChunk = (index, plaintextSize) => {
  const aad = Buffer.alloc(12);
  aad.writeUInt32BE(index, 0);
  aad.writeBigUInt64BE(BigInt(plaintextSize), 4);
  return aad;
};

const readHeader = async (filePath) => {
  const handle = await fsp.open(filePath, 'r');
  try {
    const prefix = Buffer.alloc(HEADER_SIZE);
    const { bytesRead } = await handle.read(prefix, 0, HEADER_SIZE, 0);
    if (bytesRead >= 4 && prefix.subarray(0, 4).equals(MAGIC)) {
      return {
        format: 'cab2',
        chunkSize: prefix.readUInt32BE(4),
        plaintextSize: Number(prefix.readBigUInt64BE(8)),
        baseNonce: prefix.subarray(16, 28)
      };
    }
    const stat = await handle.stat();
    return { format: 'legacy', plaintextSize: Math.max(0, stat.size - LEGACY_IV_SIZE) };
  } finally {
    await handle.close();
  }
};

export async function getPlaintextSize(filePath) {
  return (await readHeader(filePath)).plaintextSize;
}

export async function encryptFile(srcPath, destPath, secret, chunkSize = DEFAULT_CHUNK_SIZE) {
  const key = deriveKey(secret);
  const source = await fsp.open(srcPath, 'r');
  const destination = await fsp.open(destPath, 'w');

  try {
    const stat = await source.stat();
    const plaintextSize = stat.size;
    const baseNonce = Buffer.concat([crypto.randomBytes(8), Buffer.alloc(4)]);
    const header = Buffer.alloc(HEADER_SIZE);
    MAGIC.copy(header, 0);
    header.writeUInt32BE(chunkSize, 4);
    header.writeBigUInt64BE(BigInt(plaintextSize), 8);
    baseNonce.copy(header, 16);
    await destination.write(header, 0, header.length, 0);

    let srcOffset = 0;
    let destOffset = HEADER_SIZE;
    let chunkIndex = 0;

    while (srcOffset < plaintextSize) {
      const length = Math.min(chunkSize, plaintextSize - srcOffset);
      const plaintext = Buffer.allocUnsafe(length);
      await source.read(plaintext, 0, length, srcOffset);

      const cipher = crypto.createCipheriv('aes-256-gcm', key, nonceForChunk(baseNonce, chunkIndex));
      cipher.setAAD(aadForChunk(chunkIndex, plaintextSize));
      const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
      const tag = cipher.getAuthTag();

      await destination.write(ciphertext, 0, ciphertext.length, destOffset);
      destOffset += ciphertext.length;
      await destination.write(tag, 0, tag.length, destOffset);
      destOffset += tag.length;

      srcOffset += length;
      chunkIndex += 1;
    }
  } catch (error) {
    await fsp.rm(destPath, { force: true }).catch(() => {});
    throw error;
  } finally {
    await Promise.allSettled([source.close(), destination.close()]);
  }
}

function createLegacyDecryptionStream(filePath, secret, options, plaintextSize) {
  const fd = fs.openSync(filePath, 'r');
  const iv = Buffer.alloc(LEGACY_IV_SIZE);
  fs.readSync(fd, iv, 0, LEGACY_IV_SIZE, 0);
  fs.closeSync(fd);

  let start = options.start ?? 0;
  let end = options.end ?? plaintextSize - 1;
  start = Math.max(0, start);
  end = Math.min(end, plaintextSize - 1);
  if (start > end) return Readable.from([]);

  const blockIndex = Math.floor(start / 16);
  const blockOffset = start % 16;
  const ivBigInt = BigInt('0x' + iv.toString('hex'));
  const incremented = (ivBigInt + BigInt(blockIndex)) & 0xffffffffffffffffffffffffffffffffn;
  const adjustedIV = Buffer.from(incremented.toString(16).padStart(32, '0'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', legacyKey(secret), adjustedIV);
  const input = fs.createReadStream(filePath, {
    start: LEGACY_IV_SIZE + blockIndex * 16
  });

  let discard = blockOffset;
  let remaining = end - start + 1;

  async function* decrypt() {
    for await (const chunk of input.pipe(decipher)) {
      let data = chunk;
      if (discard) {
        if (data.length <= discard) {
          discard -= data.length;
          continue;
        }
        data = data.subarray(discard);
        discard = 0;
      }
      if (remaining <= 0) break;
      const output = data.subarray(0, remaining);
      remaining -= output.length;
      if (output.length) yield output;
      if (remaining <= 0) break;
    }
  }

  return Readable.from(decrypt());
}

export async function createDecryptionStream(filePath, secret, options = {}) {
  const header = await readHeader(filePath);
  const start = Math.max(0, options.start ?? 0);
  const end = Math.min(options.end ?? header.plaintextSize - 1, header.plaintextSize - 1);
  if (start > end || header.plaintextSize === 0) return Readable.from([]);

  if (header.format === 'legacy') {
    return createLegacyDecryptionStream(filePath, secret, { start, end }, header.plaintextSize);
  }

  const key = deriveKey(secret);
  const firstChunk = Math.floor(start / header.chunkSize);
  const lastChunk = Math.floor(end / header.chunkSize);

  async function* decrypt() {
    const handle = await fsp.open(filePath, 'r');
    try {
      for (let index = firstChunk; index <= lastChunk; index += 1) {
        const chunkPlainStart = index * header.chunkSize;
        const plainLength = Math.min(header.chunkSize, header.plaintextSize - chunkPlainStart);
        const recordOffset = HEADER_SIZE + index * (header.chunkSize + TAG_SIZE);
        const record = Buffer.allocUnsafe(plainLength + TAG_SIZE);
        const { bytesRead } = await handle.read(record, 0, record.length, recordOffset);
        if (bytesRead !== record.length) throw new Error('Encrypted file is truncated');

        const decipher = crypto.createDecipheriv(
          'aes-256-gcm',
          key,
          nonceForChunk(header.baseNonce, index)
        );
        decipher.setAAD(aadForChunk(index, header.plaintextSize));
        decipher.setAuthTag(record.subarray(plainLength));

        const plaintext = Buffer.concat([
          decipher.update(record.subarray(0, plainLength)),
          decipher.final()
        ]);

        const sliceStart = index === firstChunk ? start - chunkPlainStart : 0;
        const sliceEnd = index === lastChunk ? end - chunkPlainStart + 1 : plaintext.length;
        yield plaintext.subarray(sliceStart, sliceEnd);
      }
    } finally {
      await handle.close();
    }
  }

  return Readable.from(decrypt());
}
