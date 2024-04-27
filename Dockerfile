FROM oven/bun:latest

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 3025

CMD ["bun", "start"]
