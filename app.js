import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

import logger from './logger.js';
import authRouter from './routes/auth.js';
import filesRouter from './routes/files.js';
import foldersRouter from './routes/folders.js';
import sharesRouter from './routes/shares.js';
import adminRouter from './routes/admin.js';
import publicRouter from './routes/public.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4444;

app.use(helmet({
  hsts: false,
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
      "media-src": ["'self'", "data:", "blob:"],
      "frame-src": ["'self'", "blob:"],
      "connect-src": ["'self'", "ws:", "wss:", "data:", "blob:"],
    },
  },
}));
app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Shortlink Redirect
app.get('/s/:id', (req, res) => {
  res.redirect(`/?share=${req.params.id}`);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Cabinet is running, but the frontend build is missing.');
  }
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(`Cabinet Server is running on http://localhost:${PORT}`);
});