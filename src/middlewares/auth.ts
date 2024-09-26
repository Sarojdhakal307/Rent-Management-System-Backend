import express, { Request, Response, NextFunction } from "express";
import { jwtverify } from "../lib/auth";
import { stringify } from "querystring";

// interface CustomRequest extends Request {
//     id: string;
//   }
import {
  addTenantType,
  Role,
  DocumentType,
  SpaceType,
  UserPayload_token,
} from "./../types";

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
    const obj_payload : UserPayload_token = await jwtverify(token);
    console.log(obj_payload);
    // console.log(typeof(req.id))   //stringF
    if (!obj_payload.id) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    req.id  = obj_payload.id;
  } catch (er) {
    res.status(403).json({ err: "Invalid signature" });
    res.end();
    return;
  }

  next();
};
export const role_landlord_authMiddleware = async (
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
    const obj_payload : UserPayload_token = await jwtverify(token);
    console.log(obj_payload);
    // console.log(typeof(req.id))   //stringF
    if (!obj_payload.role) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    if (obj_payload.role !== 'landlord') {
      res.status(404).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    req.role  = obj_payload.role;
  } catch (er) {
    res.status(405).json({ err: "Invalid signature" });
    res.end();
    return;
  }

  next();
};