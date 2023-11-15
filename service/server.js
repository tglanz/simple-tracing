import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from 'http';

const useFetch = false;

const httpGet = url => new Promise((resolve, reject) => {
  http.get(url, {
    headers: {
      "content-type": "application/json"
    }
  }, res => {
    res.on('data', data => {
      resolve(JSON.parse(data.toString()));
    });
  })
});

async function get(url) {
  if (useFetch) {
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json"
      }
    });
    return await response.json();
  }

  return await httpGet(url);
}

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
  try {
    const data = await get(`${RANDOM_BASE_URL}?min=1&max=6`);
    const die = data.value;
    res.status(200).send({ die });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ reason: err.message })
  }
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
