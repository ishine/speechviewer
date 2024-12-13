FROM node:20-alpine3.20 AS deps

COPY package.json .
COPY package-lock.json .
RUN npm version --allow-same-version 0.0.0

FROM node:20-alpine3.20 AS builder

WORKDIR /app
COPY --from=deps package.json package-lock.json ./
RUN npm ci
COPY . .

ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev --omit=peer

FROM node:20-alpine3.20
WORKDIR /app

COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/dist dist/
COPY --from=builder /app/api.js .
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .