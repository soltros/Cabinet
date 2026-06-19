import fs from 'fs';
import crypto from 'crypto';
import { Transform, Readable } from 'stream';

const IV_SIZE = 16;

/**
 * Derives a 256-bit key from a secret string.
 */
export function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a source file to a destination file on disk.
 * Prepends a 16-byte random IV at the start of the file.
 */
export function encryptFile(srcPath, destPath, key) {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(IV_SIZE);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    
    const readStream = fs.createReadStream(srcPath);
    const writeStream = fs.createWriteStream(destPath);
    
    // Prepend the IV first
    writeStream.write(iv);
    
    readStream
      .pipe(cipher)
      .pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject);
  });
}

/**
 * Helper to treat a 16-byte IV buffer as a 128-bit integer and add blockIndex to it.
 */
function incrementIV(iv, blockIndex) {
  const ivBigInt = BigInt('0x' + iv.toString('hex'));
  const incremented = (ivBigInt + BigInt(blockIndex)) & 0xffffffffffffffffffffffffffffffffn;
  const hex = incremented.toString(16).padStart(32, '0');
  return Buffer.from(hex, 'hex');
}

/**
 * Creates a readable stream that decrypts the specified range of the file.
 * `start` and `end` are the offset bytes in the original decrypted plaintext.
 */
export function createDecryptionStream(filePath, key, options = {}) {
  // Read the IV (first 16 bytes) synchronously
  const fd = fs.openSync(filePath, 'r');
  const iv = Buffer.alloc(IV_SIZE);
  fs.readSync(fd, iv, 0, IV_SIZE, 0);
  fs.closeSync(fd);
  
  const stat = fs.statSync(filePath);
  const totalPlaintextSize = Math.max(0, stat.size - IV_SIZE);
  
  let start = options.start !== undefined ? options.start : 0;
  let end = options.end !== undefined ? options.end : totalPlaintextSize - 1;
  
  if (start < 0) start = 0;
  if (end >= totalPlaintextSize) end = totalPlaintextSize - 1;
  if (start > end) {
    return Readable.from([]);
  }
  
  const blockIndex = Math.floor(start / 16);
  const blockOffset = start % 16;
  
  const incrementedIV = incrementIV(iv, blockIndex);
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, incrementedIV);
  
  // Read starting at the aligned ciphertext block boundary
  const alignedCiphertextStart = IV_SIZE + (blockIndex * 16);
  
  const fileReadStream = fs.createReadStream(filePath, {
    start: alignedCiphertextStart,
    end: stat.size - 1
  });
  
  let bytesToDiscard = blockOffset;
  let bytesToOutput = end - start + 1;
  
  const discardAndTruncate = new Transform({
    transform(chunk, encoding, callback) {
      let data = chunk;
      
      // 1. Discard leading alignment padding
      if (bytesToDiscard > 0) {
        if (data.length <= bytesToDiscard) {
          bytesToDiscard -= data.length;
          return callback();
        } else {
          data = data.subarray(bytesToDiscard);
          bytesToDiscard = 0;
        }
      }
      
      // 2. Output only up to the range end limit
      if (bytesToOutput > 0) {
        if (data.length <= bytesToOutput) {
          bytesToOutput -= data.length;
          this.push(data);
        } else {
          this.push(data.subarray(0, bytesToOutput));
          bytesToOutput = 0;
          this.destroy();
        }
      }
      callback();
    }
  });
  
  return fileReadStream.pipe(decipher).pipe(discardAndTruncate);
}
