import express, { Request, Response } from "express";
const userRouter = express();

import {testRouter} from "../handlers/testHandlers";
import {signUpHandler,logInHandler} from "../handlers/userHandlers";

userRouter.post("/signup",signUpHandler);
userRouter.post("/login",logInHandler);



userRouter.use("/test", testRouter);



export {userRouter}