import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getMovies } from "./repositories/listMovies-repositorie";

const server = express();

server.use(cors());
server.use(express.json());

dotenv.config();

server.get("/status", async (req, res) => {
  const response = await getMovies();
  res.status(201).send(response);
});

server.listen(process.env.PORT, () => {
  console.log(`Server listen on port ${process.env.PORT}`);
});

export default server;
