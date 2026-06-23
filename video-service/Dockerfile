# ────────────────────────────────────────────────────────────────────
# Stage 1: Builder — biên dịch TypeScript sang JavaScript
# ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# Cài dependencies trước (tận dụng Docker layer cache)
COPY package*.json ./
RUN npm install

# Copy source và build
COPY . .
RUN npm run build

# ────────────────────────────────────────────────────────────────────
# Stage 2: Runner — image chạy production, có FFmpeg + Chromium
# ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner

# Cài FFmpeg và tất cả dependencies cần thiết cho Chromium headless
# (Remotion dùng Puppeteer/Chromium để render từng frame ảnh)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    chromium \
    fonts-liberation \
    fonts-noto \
    fonts-noto-cjk \
    libglib2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Remotion renderer cần biết chính xác đường dẫn tới Chromium binary
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Chỉ copy production dependencies từ builder
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS từ builder stage
COPY --from=builder /app/dist ./dist

# Copy source Remotion compositions (cần cho bundler lúc runtime)
COPY --from=builder /app/src ./src

# Thư mục output video và audio
RUN mkdir -p out/audio

EXPOSE 3001

CMD ["node", "dist/server.js"]
