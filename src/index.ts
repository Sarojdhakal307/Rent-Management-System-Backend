import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import {mainRouter} from './handlers/index'
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/',mainRouter);

app.listen(PORT, () => {
  console.log("surver Started at : ", PORT);
});
