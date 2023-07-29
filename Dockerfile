# Install modules
FROM node:lts-slim as modules

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

# Transpile Typescript
FROM node:lts-slim as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY tsoa.json ./
COPY scripts/build.js ./scripts/build.js
COPY src ./src
RUN npm run build

# Export image
FROM node:lts-slim
COPY --from=modules ./app ./app
COPY --from=build ./app/lib ./app/lib

WORKDIR /app
ENTRYPOINT ["sh", "-c", "node", "lib/index.js"]
