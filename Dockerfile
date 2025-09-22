# Stage 1: Build the Nuxt application
FROM node:20.19.2 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run generate

# Stage 2: Create the production image with a shared volume
FROM node:20.19-slim as serve
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["npx", "serve", ".output/public"]