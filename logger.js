import winston from 'winston';
import path from 'path';
import { STORAGE_ROOT } from './storage.js';
import { LOG_LEVEL } from './config.js';

const LOG_FILE = path.join(STORAGE_ROOT, 'cabinet.log');

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: LOG_FILE,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) =>
          `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
        )
      )
    })
  ]
});

export default logger;
