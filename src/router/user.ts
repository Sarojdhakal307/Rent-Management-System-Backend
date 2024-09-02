import express, { Request, Response } from "express";
const userRouter = express();

import { testRouter } from "../handlers/testHandlers";
import {
  signupRequestHandler,
  signUpHandler,
  logInHandler,
  addtenantHandler,
} from "../handlers/userHandlers";


import { authmiddleware } from "./../middlewares/auth";

userRouter.post("/l/signup", signupRequestHandler);
userRouter.post("/l/signup-verify", signUpHandler);
userRouter.post("/l/login", logInHandler);

userRouter.post("/l/addtenant",authmiddleware,addtenantHandler);

userRouter.use("/test", authmiddleware, testRouter);

export { userRouter };
