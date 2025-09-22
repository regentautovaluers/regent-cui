# Stage 1: Build the Nuxt application
FROM node:20.19.2 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

RUN ls -l .output/public

# Stage 2: Create the production image with a shared volume
FROM node:20.19-slim as serve
WORKDIR /app

COPY --from=build /app/.output /app/.output
RUN ls -l /app/.output/public

# Nuxt's server entry point is at `.output/server/index.mjs`
# and the static files are at `.output/public`
# This structure makes it easy to mount `.output/public` as a volume.
EXPOSE 3000

# The start command for your Nuxt app
CMD ["node", ".output/server/index.mjs"]