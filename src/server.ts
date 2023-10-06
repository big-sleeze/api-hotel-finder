import { config } from "./config/config";
import express, { urlencoded } from "express";
import http from "http";
import mongoose from "mongoose";
import logger from "./library/logger";
import bookingRoutes from "./routes/routes";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    logger.info("Connected!");
    startServer();
  })
  .catch((error) => {
    logger.error(error);
  });

const startServer = () => {
  app.use((req, res, next) => {
    logger.info(
      `Incoming => Method: [${req.method}], Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      logger.info(
        `Outgoing => Method: [${req.method}], Url: [${req.url}], IP: [${req.socket.remoteAddress}], Status: [${res.statusCode}]`
      );
    });

    next();
  });
  app.use(urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  app.use("/", bookingRoutes);

  app.get("/healthcheck", (req, res, next) => {
    res.status(200).json({ message: "200: The API is up and running." });
  });

  app.use("*", (req, res, next) => {
    const error = new Error("404: Page not Found!");
    logger.error(error);

    res.status(404).json({ message: "404: Page not Found!" });
  });

  http.createServer(app).listen(config.server.port, () => {
    logger.info("Server running on port " + config.server.port);
  });
};
