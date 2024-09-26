import express, { Request, Response } from "express";
const userRouter = express();

import { testRouter } from "../handlers/testHandlers";
import {
  signupRequestHandler,
  signUpHandler,
  logInHandler,
  addtenantHandler,
  deletetenantHandler,
  alltenantHandler,
  tenantHandler,
  changePasswordHandler,
} from "../handlers/userHandlers";

import { authmiddleware, landlordMiddleware } from "./../middlewares/auth";

userRouter.post("/l/signup", signupRequestHandler);
userRouter.post("/l/signup-verify", signUpHandler);
userRouter.post("/l/login", logInHandler);

userRouter.put(
  "/l/changepassword",
  authmiddleware,
  landlordMiddleware,
  changePasswordHandler
);

userRouter.post(
  "/l/addtenant",
  authmiddleware,
  landlordMiddleware,
  addtenantHandler
);
userRouter.get(
  "/l/alltenant",
  authmiddleware,
  landlordMiddleware,
  alltenantHandler
);
userRouter.get(
  "/l/tenant/:id",
  authmiddleware,
  landlordMiddleware,
  tenantHandler
);
userRouter.delete(
  "/l/deletetenant/:id",
  authmiddleware,
  landlordMiddleware,
  deletetenantHandler
);

userRouter.use("/test", authmiddleware, testRouter);

export { userRouter };
