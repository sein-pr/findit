FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN sh -lc 'for i in 1 2 3; do npm ci --include=dev --no-audit --no-fund && break; echo "npm ci failed, retrying... ($i/3)"; sleep 5; done; test -x node_modules/.bin/next'

FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "start"]
