import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const server = express();

server.use(cors());
server.use(express.json());

dotenv.config();

server.get("/status", (req, res) => {
  res.sendStatus(201);
});

server.listen(process.env.PORT, () => {
  console.log(`Server listen on port ${process.env.PORT}`);
});
