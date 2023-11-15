import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from 'http';

const httpGet = (url, headers) => new Promise((resolve, reject) => {
  http.get(url, {
    headers,
  }, res => {
    res.on('data', data => {
      resolve(JSON.parse(data.toString()));
    });
  })
});

const {
  PORT = 8000,
  RANDOM_BASE_URL = "http://localhost:8001/random"
} = process.env;

const server = express();

const loggingMiddleware = pinoHttp({
  autoLogging: true,
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

server.use(cors());
server.use(loggingMiddleware);

server.use("/roll-die", async (req, res) => {
  req.log.info("using get");
  const data = await httpGet(`${RANDOM_BASE_URL}?min=1&max=6`, {
    headers: {
      "Content-Type": "application/json",
    }
  });

  const die = data.value;
  res.status(200).send({ die });
});

server.use("/random", async (req, res) => {
  const min = +(req.params.min || 1);
  const max = +(req.params.max || 6);
  const value = Math.floor(min + (Math.random() * (max - min + 1)));
  res.status(200).send({ value });
});

server.listen(PORT, "0.0.0.0", () => {
  loggingMiddleware.logger.info({ port: PORT }, "Server is running");
});
