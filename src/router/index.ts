import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

const mainRouter = express();

mainRouter.use(cookieParser());

import { testRouter } from "../handlers/testHandlers";
import { userRouter } from "./user";
import { docsRouter } from "./docs";

mainRouter.use("/docs", docsRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/test", testRouter);

export { mainRouter };
