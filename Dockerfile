FROM node:24-trixie AS builder
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-trixie-slim AS runtime
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg poppler-utils \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node app.js config.js db.js storage.js crypto.js logger.js swagger.yaml ./
COPY --chown=node:node controllers ./controllers
COPY --chown=node:node routes ./routes
COPY --chown=node:node middlewares ./middlewares
COPY --from=builder --chown=node:node /app/dist ./dist

RUN mkdir -p /app/users && chown -R node:node /app/users /app
USER node

ENV PORT=4444
ENV NODE_ENV=production
ENV STORAGE_PATH=/app/users
ENV MAX_UPLOAD_SIZE=524288000

EXPOSE 4444
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4444/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "app.js"]
