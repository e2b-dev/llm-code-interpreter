# Install modules
FROM node:lts-slim as modules

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Transpile Typescript
FROM node:lts-slim as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY tsoa.json ./
COPY ai-plugin.json ./
COPY scripts/ ./scripts/
COPY src ./src
RUN npm run build

# Export image
FROM node:lts-slim
COPY --from=modules ./app ./app
COPY --from=build ./app/lib ./app/lib
COPY --from=build ./app/openapi.yaml ./app/ai-plugin.json ./app/

WORKDIR /app

EXPOSE 3000

ENTRYPOINT ["node", "lib/index.js"]
