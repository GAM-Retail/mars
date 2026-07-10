FROM node:24-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm --activate

WORKDIR /app

# Install dependencies
FROM base AS deps

ENV CI=true
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the application
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use dummy credentials to satisfy Prisma's schema parsing during build.
# This prevents leaking real credentials in Docker image layers.
ENV DATABASE_URL="mysql://dummy:dummy@dummy:3306/dummy"
ENV SHADOW_DATABASE_URL="mysql://dummy:dummy@dummy:3306/dummy"

RUN pnpm exec prisma generate
RUN pnpm build

# Production image
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 reactrouter && chown -R reactrouter:nodejs /app

COPY --chown=reactrouter:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=reactrouter:nodejs --from=builder /app/build ./dist
COPY --chown=reactrouter:nodejs --from=builder /app/package.json ./package.json

USER reactrouter

EXPOSE 3000

CMD ["pnpm", "preview"]