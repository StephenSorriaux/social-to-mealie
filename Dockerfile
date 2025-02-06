FROM oven/bun:debian

WORKDIR /app

COPY package.json .
COPY bun.lock .
COPY src src
COPY tsconfig.json .
COPY public public

ENV NODE_ENV production
RUN bun install --production

RUN apt update && apt install -y \
    wget \
    curl \
    unzip \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm-dev \
    libxkbcommon0 \
    libpango-1.0-0 \
    libxcursor1 \
    && wget -qO- https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb > /tmp/chrome.deb \
    && apt install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb \
    && apt clean && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
RUN chown -R bun:bun /app
USER bun
CMD ["bun", "src/index.ts"]

EXPOSE 3000
