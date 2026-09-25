import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

import logger from './logger.js';
import { PORT, TRUST_PROXY, UPLOAD_REQUEST_TIMEOUT_MS } from './config.js';
import authRouter from './routes/auth.js';
import filesRouter from './routes/files.js';
import foldersRouter from './routes/folders.js';
import sharesRouter from './routes/shares.js';
import adminRouter from './routes/admin.js';
import publicRouter from './routes/public.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

if (TRUST_PROXY) app.set('trust proxy', 1);

app.use(helmet({
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "blob:"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "media-src": ["'self'", "blob:"],
      "frame-src": ["'self'", "blob:"],
      "connect-src": ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use((req, res, next) => {
  req.on('aborted', () => {
    logger.warn('Request aborted before completion', {
      method: req.method,
      url: req.originalUrl,
      contentLength: req.headers['content-length'] || null,
      userAgent: req.headers['user-agent'] || null
    });
  });
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

const api = express.Router();
api.use('/auth', authRouter);
api.use('/files', filesRouter);
api.use('/folders', foldersRouter);
api.use('/shares', sharesRouter);
api.use('/admin', adminRouter);
api.use('/public', publicRouter);

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', api);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(404).send('Cabinet is running, but the frontend build is missing.');
});

app.use((err, req, res, next) => {
  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    code: err?.code || null,
    statusCode: err?.statusCode || err?.status || 500,
    error: err?.stack || err?.message || String(err)
  });
  if (res.headersSent) return next(err);
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File exceeds maximum upload size' });
  }
  const statusCode = Number(err?.statusCode || err?.status) || 500;
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : (err?.message || 'Request failed')
  });
});

const server = app.listen(PORT, () => {
  logger.info(`Cabinet Server is running on http://localhost:${PORT}`);
});

server.requestTimeout = UPLOAD_REQUEST_TIMEOUT_MS;
server.on('clientError', (error, socket) => {
  logger.warn('HTTP client connection error', { error: error.message });
  if (!socket.destroyed) socket.destroy();
});
