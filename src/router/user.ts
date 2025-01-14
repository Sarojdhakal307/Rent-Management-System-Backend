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
  logInTenantHandler,       //Tenant Handler
  tenantprofileHandler,
  islogedinLandlord,
} from "../handlers/userHandlers";

import { authmiddlewarelandlord, authmiddlewaretenant } from "./../middlewares/auth";

userRouter.post("/l/signup", signupRequestHandler);
userRouter.post("/l/signup-verify", signUpHandler);
userRouter.post("/l/login", logInHandler);
userRouter.post("/l/isLogedin", islogedinLandlord);

userRouter.put("/l/changepassword", authmiddlewarelandlord, changePasswordHandler);
userRouter.post("/l/addtenant", authmiddlewarelandlord, addtenantHandler);
userRouter.get("/l/alltenant", authmiddlewarelandlord, alltenantHandler);
userRouter.get("/l/tenant/:id", authmiddlewarelandlord, tenantHandler);
userRouter.delete("/l/deletetenant/:id", authmiddlewarelandlord, deletetenantHandler);


userRouter.post("/t/login", logInTenantHandler);
userRouter.get("/t/myprofile",authmiddlewaretenant, tenantprofileHandler);



userRouter.use("/test", testRouter);

export { userRouter };
