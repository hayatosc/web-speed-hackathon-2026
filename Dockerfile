# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.14.0
ARG PNPM_VERSION=10.32.1

FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME=/pnpm

WORKDIR /app
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm@${PNPM_VERSION}

FROM base AS build

RUN --mount=type=cache,target=/root/.apt apt-get update && apt-get install -y brotli python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY ./application/package.json ./application/pnpm-lock.yaml ./application/pnpm-workspace.yaml ./
COPY ./application/server/package.json ./server/package.json
COPY ./application/e2e/package.json ./e2e/package.json
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile

COPY ./application .

RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build

RUN find /app/build/client -type f \( -name "*.js" -o -name "*.css" \) -exec gzip -k {} \; -exec brotli -k {} \;

# Prune to production deps only
RUN --mount=type=cache,target=/pnpm/store CI=true pnpm install --frozen-lockfile --prod --filter @web-speed-hackathon-2026/server

# Final image — only what's needed at runtime
FROM node:${NODE_VERSION}-slim

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/database.sqlite ./server/database.sqlite
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/dist/index.js"]
