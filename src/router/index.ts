import express, { Request, Response } from "express";
const mainRouter = express();

import { testRouter } from "../handlers/testHandlers";
import { userRouter } from "./user";

mainRouter.get("/", (req: Request, res: Response) => {
  res.json({ page: "home" });
});

mainRouter.use("/user", userRouter);
mainRouter.use("/test", testRouter);

export { mainRouter };
