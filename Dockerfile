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


# FROM node:18.13.0
# WORKDIR /app
# COPY ./package.json /app/package.json
# RUN npm install
# COPY .env /app/.env   
# COPY . /app
# RUN npm run generate
# EXPOSE 3000

# CMD ["npx", "serve", ".output/public"]

