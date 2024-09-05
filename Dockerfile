FROM node:18.13.0
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install   
COPY . /app
RUN npm run generate
EXPOSE 3000

CMD ["npx", "serve", ".output/public"]

