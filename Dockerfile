FROM node:20.19.2 AS build
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install   
COPY . /app
RUN npm run build

FROM node:20.19-slim as serve
WORKDIR /app

COPY --from=build /app/.output /app/.output
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

