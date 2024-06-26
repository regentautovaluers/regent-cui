FROM node:16-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS production-stage
WORKDIR /app
COPY --from=build-stage /app ./

RUN npm install 
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
CMD ["npm", "start"]




