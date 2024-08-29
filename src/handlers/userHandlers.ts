import { Request, Response } from "express";
import { db } from "../db/db_connect";
import { AdminTable } from "../db/schema";
import { hashPassword, jwtgenerate } from "../lib/auth";
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
