from node:20-alpine3.17

ADD ./server.js /app/
ADD ./package.json /app
ADD ./package-lock.json /app

WORKDIR /app
RUN npm install

CMD ["npm", "start"]
