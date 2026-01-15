import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In production (Docker), this maps to /app/users.
// In dev, we map it to the project root's user_data folder.
const STORAGE_ROOT = process.env.STORAGE_PATH || path.join(__dirname, 'user_data');

/**
 * Ensures the user's storage sandbox exists.
 */
const initUserStorage = async (userId) => {
  const userDir = path.join(STORAGE_ROOT, userId);
  const paths = {
    userDir,
    data: path.join(userDir, 'user_data'),
    thumbnails: path.join(userDir, 'thumbnails')
  };

  await fs.mkdir(paths.data, { recursive: true });
  await fs.mkdir(paths.thumbnails, { recursive: true });

  return paths;
};

export { initUserStorage, STORAGE_ROOT };