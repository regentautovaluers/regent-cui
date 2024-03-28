FROM node:18.13.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18.13.0-slim

# Set working directory
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/static ./static
COPY --from=builder /app/nuxt.config.js .
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 8000

CMD ["npm", "run", "dev"]
