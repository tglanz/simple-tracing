# Documentation below states that ESM instrumentation not supported for node 20
# https://www.npmjs.com/package/@opentelemetry/instrumentation#instrumentation-for-es-modules-in-nodejs-experimental
from node:19-alpine3.17

ADD ./server.js /app/
ADD ./manual-otel.js /app/
ADD ./package.json /app
ADD ./package-lock.json /app

WORKDIR /app
RUN npm install

CMD ["npm", "start"]
