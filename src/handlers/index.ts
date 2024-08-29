import express, { Request, Response } from "express";

import {testRouter} from "./testHandlers";
const mainRouter = express();

mainRouter.get("/", (req: Request, res: Response) => {
    res.send("I am here!");
});

mainRouter.use("/test", testRouter);



export {mainRouter}