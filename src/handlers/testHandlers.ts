import express, { Request, Response } from "express";
import { authmiddleware } from "../middlewares/auth";


const testRouter = express();

testRouter.get("/", authmiddleware, async (req: Request, res: Response) => {
  console.log("i am test");

  res.json({ Route: "test" });
});

testRouter.get("/s", async (req: Request, res: Response) => {
  res.json({ Route: "test/s" });
});

export { testRouter };
