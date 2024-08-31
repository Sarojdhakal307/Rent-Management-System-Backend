import express, { Request, Response } from "express";
const userRouter = express();

import {testRouter} from "../handlers/testHandlers";
import {signupRequestHandler,signUpHandler,logInHandler} from "../handlers/userHandlers";

userRouter.post("/signup",signupRequestHandler);
userRouter.post("/signup-verify",signUpHandler);
userRouter.post("/login",logInHandler);



userRouter.use("/test", testRouter);



export {userRouter}