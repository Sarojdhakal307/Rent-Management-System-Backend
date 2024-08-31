import express, { Request, Response } from "express";
import  cookieParser from 'cookie-parser';

const mainRouter = express();

mainRouter.use(cookieParser())

import { testRouter } from "../handlers/testHandlers";
import { userRouter } from "./user";


mainRouter.get("/", (req: Request, res: Response) => {
  res.json({ page: "home" });
});

mainRouter.use("/user", userRouter);
mainRouter.use("/test", testRouter);

export { mainRouter };
