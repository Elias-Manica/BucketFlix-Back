import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { userRouter } from "./router/users.router";
import { sessionRouter } from "./router/session.router";
import { connectDb } from "./database/database";

const server = express();

server.use(cors());
server.use(express.json());

dotenv.config();

server
  .get("/status", async (req, res) => {
    res.sendStatus(201);
  })
  .use("/sign-up", userRouter)
  .use("/sign-in", sessionRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(server);
}

export default server;
