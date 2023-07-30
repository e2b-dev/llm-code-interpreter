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

COPY tsconfig.json .
COPY tsoa.json .
COPY scripts/ ./scripts/
COPY src ./src
RUN npm run build

# Export image
FROM node:lts-slim

WORKDIR /app

RUN mkdir -p .well-known
COPY .well-known/ai-plugin.json ./.well-known/ai-plugin.json

COPY --from=modules ./app .
COPY --from=build ./app/lib ./lib
COPY --from=build ./app/openapi.yaml .

EXPOSE 3000

CMD ["node", "lib/index.js"]
