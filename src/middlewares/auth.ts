import express, { Request, Response, NextFunction } from "express";
import { jwtverify } from "../lib/auth";
import { stringify } from "querystring";

// interface CustomRequest extends Request {
//     id: string;
//   }
interface CustomRequest extends Request {
  role?: string;
  id?: string;
}
import { db } from "../db/db_connect";
import { sql, SQL, eq, lt, gte, ne, or, and } from "drizzle-orm";

import { LandlordTable, TenantTable } from "../db/schema";

import {
  addTenantType,
  Role,
  DocumentType,
  SpaceType,
  UserPayload_token,
} from "./../types";

export const authmiddlewarelandlord = async (
  req: CustomRequest,
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
    const obj_payload: UserPayload_token | undefined | null = await jwtverify(
      token
    );
    if (obj_payload === undefined) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    // console.log(obj_payload);
    // console.log(typeof(req.id))   //stringF
    if (!obj_payload.id) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
// **
    const user = await db
      .select()
      .from(LandlordTable)
      .where(eq(LandlordTable.id, obj_payload.id));

    if (user.length === 0) {
      res.status(400);
      res.json({ err: "Unauthorized token!" });
      res.end();
      return;
    }
  //**
    if (!obj_payload.role) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    if (obj_payload.role !== "landlord") {
      res.status(404).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    req.role = obj_payload.role;
  // ** 
    req.id = obj_payload.id;
  } catch (er) {
    res.status(403).json({ err: "Invalid signature" });
    res.end();
    return;
  }

  next();
};
// export const landlordMiddleware = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const token: string | undefined = req.headers.authorization;
//   const token: string | undefined = req.cookies.Token;
//   if (!token) {
//     res.status(403).json({ err: "unauthorized" });
//     res.end();
//     return;
//   }
//   try {
//     const obj_payload: UserPayload_token | undefined | null = await jwtverify(
//       token
//     );
//     // console.log(obj_payload);
//     // console.log(typeof(req.id))   //stringF
//     if (obj_payload === undefined) {
//       res.status(403).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     if (!obj_payload.role) {
//       res.status(403).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     if (obj_payload.role !== "landlord") {
//       res.status(404).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     req.role = obj_payload.role;
//   } catch (er) {
//     res.status(405).json({ err: "Invalid signature" });
//     res.end();
//     return;
//   }

//   next();
// };

export const authmiddlewaretenant = async (
  req: CustomRequest,
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
    const obj_payload: UserPayload_token | undefined | null = await jwtverify(
      token
    );
    if (obj_payload === undefined) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    // console.log(obj_payload);
    // console.log(typeof(req.id))   //stringF
    if (!obj_payload.id) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    // **
    const user = await db
      .select()
      .from(TenantTable)
      .where(eq(TenantTable.id, obj_payload.id));

    if (user.length === 0) {
      res.status(400);
      res.json({ err: "Unauthorized token!" });
      res.end();
      return;
    }

    if (!obj_payload.role) {
      res.status(403).json({ err: "Invalid signature" });
      res.end();
      return;
    }
    if (obj_payload.role !== "tenant") {
      res.status(404).json({ err: "Invalid signature" });
      res.end();
      return;
    }
  // ** 
    req.id = obj_payload.id;
    req.role = obj_payload.role;

  } catch (er) {
    res.status(403).json({ err: "Invalid signature" });
    res.end();
    return;
  }

  next();
};

// export const tenantMiddleware = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const token: string | undefined = req.headers.authorization;
//   const token: string | undefined = req.cookies.Token;
//   if (!token) {
//     res.status(403).json({ err: "unauthorized" });
//     res.end();
//     return;
//   }
//   try {
//     const obj_payload: UserPayload_token | undefined | null = await jwtverify(
//       token
//     );
//     // console.log(obj_payload);
//     // console.log(typeof(req.id))   //stringF
//     if (obj_payload === undefined) {
//       res.status(403).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     if (!obj_payload.role) {
//       res.status(403).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     if (obj_payload.role !== "tenant") {
//       res.status(404).json({ err: "Invalid signature" });
//       res.end();
//       return;
//     }
//     req.role = obj_payload.role;
//   } catch (er) {
//     res.status(405).json({ err: "Invalid signature" });
//     res.end();
//     return;
//   }

//   next();
// };
