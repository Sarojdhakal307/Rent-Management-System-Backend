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
    res.json({
      page: "home",
      message: "Welcome to Rent Management System API",
      version: "1.0.0",
      author: "Saroj Dhakal",
      documentation: {
        docs_hub: "/api/docs",
        readme: "/api/docs/readme",
        readme_html: "/api/docs/readme/html",
        api_docs: "/api/docs/api",
        api_docs_html: "/api/docs/api/html",
        github:
          "https://github.com/Sarojdhakal307/Rent-Management-System-Backend",
      },
      endpoints: {
        landlord: "/api/user/l/*",
        tenant: "/api/user/t/*",
        test: "/api/test/*",
      },
      status: "🟢 Online",
    });
  });
  app.use("/api", mainRouter);

  app.listen(PORT, () => {
    console.log("surver Started at : ", PORT);
  });
}
