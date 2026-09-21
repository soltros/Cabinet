const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const parsePositiveInteger = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parsePositiveInteger('PORT', 4444);
export const JWT_SECRET = required('JWT_SECRET');
export const ENCRYPTION_KEY = required('ENCRYPTION_KEY');
export const ADMIN_PASSWORD = required('ADMIN_PASSWORD');
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const REGISTRATION_CODE = process.env.REGISTRATION_CODE || null;
export const ALLOW_REGISTRATION = parseBoolean(process.env.ALLOW_REGISTRATION, false);
export const TRUST_PROXY = parseBoolean(process.env.TRUST_PROXY, false);
export const MAX_UPLOAD_SIZE = parsePositiveInteger('MAX_UPLOAD_SIZE', 500 * 1024 * 1024);
export const DEFAULT_USER_QUOTA = parsePositiveInteger('DEFAULT_USER_QUOTA', 50 * 1024 * 1024 * 1024);
export const PREVIEW_MAX_SIZE = parsePositiveInteger('PREVIEW_MAX_SIZE', 100 * 1024 * 1024);
export const THUMBNAIL_CONCURRENCY = parsePositiveInteger('THUMBNAIL_CONCURRENCY', 2);

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

if (ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
}

if (ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_PASSWORD must be at least 12 characters long');
}
