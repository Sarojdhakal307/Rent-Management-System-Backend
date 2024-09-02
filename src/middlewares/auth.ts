import express, { Request, Response, NextFunction } from "express";
import { jwtverify } from "../lib/auth";
import { stringify } from "querystring";

// interface CustomRequest extends Request {
//     id: string;
//   }

export const authmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token: string | undefined = req.headers.authorization;
  const token: string | undefined = req.cookies.Token;
  if (!token) {
    res.status(403).json({ err: "unauthorized" });
    res.end();
    return;
  }
  try {
    const id = await jwtverify(token);
    // console.log(typeof(req.id))   //stringF
    if (!id) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    req.id = id;
  } catch (er) {
    res.status(403).json({ err: "Invalid signature" });
    res.end();
    return;
  }

  next();
};
