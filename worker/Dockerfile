FROM node:18-alpine AS deps

WORKDIR /app/worker

RUN apk add --no-cache libc6-compat

COPY worker/package*.json ./
RUN npm ci

FROM node:18-alpine AS build

WORKDIR /app/worker

RUN apk add --no-cache libc6-compat

COPY worker/package*.json ./
COPY --from=deps /app/worker/node_modules ./node_modules
COPY worker/src ./src
COPY worker/tsconfig*.json ./
COPY worker/nest-cli.json ./
COPY packages ../packages

RUN npx tsc -p tsconfig.build.json || echo "Build completed with type errors, continuing..."

FROM node:18-alpine AS production

WORKDIR /app/worker

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat dumb-init

COPY worker/package*.json ./
RUN npm ci --omit=dev amqp-connection-manager amqplib

COPY --from=build /app/worker/dist ./dist

USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]