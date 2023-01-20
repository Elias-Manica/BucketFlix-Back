import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { userRouter } from "./router/users.router";

const server = express();

server.use(cors());
server.use(express.json());

dotenv.config();

server
  .get("/status", async (req, res) => {
    res.sendStatus(201);
  })
  .use("/sign-up", userRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server listen on port ${process.env.PORT}`);
});

export default server;
