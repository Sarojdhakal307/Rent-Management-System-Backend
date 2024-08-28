import express, { Request, Response } from "express";
// const express = require("express");
const PORT = 8081;

const app = express();

app.get("/", (req:Request, res:Response) => {
  res.send("I am here");
});

app.listen(PORT, () => {
  console.log("surver Started at : ", PORT);
});
