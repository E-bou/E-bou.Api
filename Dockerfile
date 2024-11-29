FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3025

CMD ["npm", "start"]
