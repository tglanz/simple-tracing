from node:20-alpine3.17

ADD ./src /app/src
ADD ./package.json /app
ADD ./package-lock.json /app
ADD ./index.html /app

WORKDIR /app
RUN npm install && npm run build

EXPOSE 4173
CMD ["npm", "run", "dev", "--", "--host"]
