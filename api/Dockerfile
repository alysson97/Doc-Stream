FROM node:18-alpine AS deps

WORKDIR /app/api

RUN apk add --no-cache libc6-compat

COPY api/package*.json ./
RUN npm ci

FROM node:18-alpine AS build

WORKDIR /app/api

RUN apk add --no-cache libc6-compat

COPY worker/package*.json ./
COPY --from=deps /app/api/node_modules ./node_modules
COPY api/src ./src
COPY api/tsconfig*.json ./
COPY api/nest-cli.json ./
COPY packages ../packages

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app/api

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat dumb-init

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/api/dist ./dist

USER node

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
