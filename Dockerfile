
FROM node:18.13.0
WORKDIR /app
COPY package.json package-lock.json* /app/
RUN npm cache clean --force
RUN npm install 
COPY . /app
RUN npm run generate
EXPOSE 3000
CMD ["npx", "serve", ".output/public"]
