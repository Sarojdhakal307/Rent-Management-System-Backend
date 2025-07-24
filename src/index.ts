import dotenv from "dotenv";
import express from "express";
import { mainRouter } from "./router";
import cluster from "cluster";
import cors from "cors";
const numCPUs = require("node:os").availableParallelism();
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.get("/", (req, res) => {
    res.send("Hello From Saroj Dhakal's Rent Management System Backend!");
  });
  app.use("/api", mainRouter);

  app.listen(PORT, () => {
    console.log("surver Started at : ", PORT);
  });
}
