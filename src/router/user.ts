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

import {
  authmiddleware,
  role_landlord_authMiddleware,
} from "./../middlewares/auth";

userRouter.post("/l/signup", signupRequestHandler);
userRouter.post("/l/signup-verify", signUpHandler);
userRouter.post("/l/login", logInHandler);

userRouter.put(
  "/l/changepassword",
  authmiddleware,
  role_landlord_authMiddleware,
  changePasswordHandler
);

userRouter.post(
  "/l/addtenant",
  authmiddleware,
  role_landlord_authMiddleware,
  addtenantHandler
);
userRouter.get(
  "/l/alltenant",
  authmiddleware,
  role_landlord_authMiddleware,
  alltenantHandler
);
userRouter.get(
  "/l/tenant/:id",
  authmiddleware,
  role_landlord_authMiddleware,
  tenantHandler
);
userRouter.delete(
  "/l/deletetenant/:id",
  authmiddleware,
  role_landlord_authMiddleware,
  deletetenantHandler
);

userRouter.use("/test", authmiddleware, testRouter);

export { userRouter };
