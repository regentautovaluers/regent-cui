
FROM node:18.13.0
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install
COPY .env /app/.env   
COPY . /app
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "preview"]



