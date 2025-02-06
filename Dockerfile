FROM oven/bun:debian

WORKDIR /app
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY public public

ENV NODE_ENV production
RUN useradd -m run-user
USER run-user

CMD ["bun", "src/index.ts"]

EXPOSE 3000