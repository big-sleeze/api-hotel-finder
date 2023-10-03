import { config } from "./config/config";
import express, { urlencoded } from "express";
import http from "http";
import mongoose from "mongoose";
import logger from "./library/logger";
import bookingRoutes from "./routes/routes";
import cors from "cors";

const router = express();

router.use(cors());

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
  router.use((req, res, next) => {
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
  router.use(urlencoded({ extended: true }));
  router.use(express.json());

  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
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

  router.use("/", bookingRoutes);

  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Returns API operational status
   *     responses:
   *       200:
   *         description: API is  running
   */
  router.get("/healthcheck", (req, res, next) => {
    res.status(200).json({ message: "200: The API is up and running." });
  });

  router.use("*", (req, res, next) => {
    const error = new Error("404: Page not Found!");
    logger.error(error);

    res.status(404).json({ message: "404: Page not Found!" });
  });

  http.createServer(router).listen(config.server.port, () => {
    logger.info("Server running on port " + config.server.port);
  });
};
