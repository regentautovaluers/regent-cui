# Stage 1: Build the Nuxt application
FROM node:22.23 AS build
WORKDIR /app

# Enable Corepack to manage pnpm automatically
RUN npm install -g pnpm@latest-11

# Copy package manifest and lockfile for optimal layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile 

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# Stage 2: Create the production image with a shared volume
FROM node:22-slim AS serve

RUN apt-get update && apt-get install -y \
    wkhtmltopdf \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]