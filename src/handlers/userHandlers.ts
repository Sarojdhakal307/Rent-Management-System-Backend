import { Request, Response } from "express";
import { eq, lt, gte, ne } from "drizzle-orm";

import { db } from "../db/db_connect";
import { AdminTable } from "../db/schema";
import { hashPassword, jwtgenerate, comparePassword } from "../lib/auth";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

export async function signUpHandler(req: Request, res: Response) {
  const { name, email, password, address } = await req.body;

  if (!name || !email || !password || !address) {
    return res.status(401).json({ error: "Missing required parameter" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return;
    }
    const user = await db
      .insert(AdminTable)
      .values({
        name: name as string,
        username: uid.rnd() as string,
        email: email as string,
        password: hashedPassword as string,
        address: address as string,
      })
      .returning({
        id: AdminTable.id,
      });
    const token = await jwtgenerate(user[0].id);

    res.json({ signup: true, token: token });
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
}

export async function logInHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).json({ err: "Missing required parameter" });
    return;
  }
  try {
    const user = await db
      .selectDistinct()
      .from(AdminTable)
      .where(eq(AdminTable.email, email));

    const userAccess = await comparePassword(password, user[0].password);

    if (!userAccess) {
      res.status(400).json({ err: "Invalid password" });
      return;
    }

    const Token = await jwtgenerate(user[0].id);
    res.status(200).json({ login: "sucess", token: Token });
    return;
  } catch (err) {
    res.status(501).json({ err: "Invalid Email" });
    return;
  }
}
