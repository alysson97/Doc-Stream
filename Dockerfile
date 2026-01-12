FROM node:18-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS deps

COPY package*.json ./
RUN npm ci

FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
