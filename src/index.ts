import dotenv from "dotenv";
import express from "express";
import { mainRouter } from "./router";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log("surver Started at : ", PORT);
});
