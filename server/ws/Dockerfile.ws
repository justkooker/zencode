FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY ws-server.js ./

EXPOSE 8080

CMD ["node", "ws-server.js"]
