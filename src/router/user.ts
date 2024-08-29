import express, { Request, Response } from "express";
const userRouter = express();

import {testRouter} from "../handlers/testHandlers";
import {signUpHandler} from "../handlers/userHandlers";

userRouter.post("/signup",signUpHandler);



userRouter.use("/test", testRouter);



export {userRouter}