# Stage 1: Build
FROM node:20-bullseye AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Frontend
RUN npm run build

# Stage 2: Production
FROM node:20-bullseye

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg poppler-utils python3 make g++ build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source files
COPY app.js auth.js db.js storage.js swagger.yaml ./

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Create storage directory for volume mapping
RUN mkdir -p /app/users

# Environment setup
ENV PORT=4444
ENV NODE_ENV=production
ENV STORAGE_PATH=/app/users
ENV MAX_UPLOAD_SIZE=524288000

EXPOSE 4444

CMD ["node", "app.js"]
