import dotenv from "dotenv";

dotenv.config();

const MONGO_DB = process.env.MONGO_DB || "";
const MONGO_USER = process.env.MONGO_USER || "";
const MONGO_PW = process.env.MONGO_PW || "";
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.potot0s.mongodb.net/${MONGO_DB}`;
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 4444;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};
