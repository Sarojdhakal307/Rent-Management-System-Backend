import { Request, Response } from "express";
import { sql, SQL, eq, lt, gte, ne, or, and } from "drizzle-orm";

import { db } from "../db/db_connect";
import { LandlordTable, TenantTable } from "../db/schema";
import {
  hashPassword,
  jwtgenerate,
  jwtverify,
  comparePassword,
  jwtgenerateSignUptToken,
  jwtverifySignUptToken,
  jwtgenerate_OTP,
  jwtverify_OTP,
} from "../lib/auth";

import { addTenantType, Role, DocumentType, SpaceType } from "./../types";
import { transporter, signUpMailOTP, generateOTP } from "../lib/mailServices";
import { generateddocId, generatespaceId } from "../lib/lib";

import ShortUniqueId from "short-unique-id";

import validator from "validator";

const uid = new ShortUniqueId();

export async function signupRequestHandler(req: Request, res: Response) {
  const { name, email, password, address } = await req.body;

  if (!name || !email || !password || !address) {
    return res.status(401).json({ error: "Missing required parameter" });
  }
  try {
    const validMailFlag = validator.isEmail(email); //formate validation
    if (!validMailFlag) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const user = await db
      .select()
      .from(LandlordTable)
      .where(eq(LandlordTable.email, email));

    if (user.length !== 0) {
      res.status(401);
      res.json({ err: "User already exist" });
      res.end();
      return;
    }

    // console.log("ValidMailFlag : ", validMailFlag);
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      res.status(404);
      res.json({ err: "passwordHashinv err" });
      res.end();
      return;
    }
    const payload = {
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      address: address,
    };

    const { signupOTP_MailOptions, OTP } = await signUpMailOTP(email, name);

    const payloadToken = await jwtgenerateSignUptToken(payload);
    const otpToken = await jwtgenerate_OTP(OTP.toString());

    transporter.sendMail(signupOTP_MailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.cookie("payloadToken", payloadToken, { maxAge: 300000 }); // 300 seconds
      res.cookie("otpToken", otpToken, { maxAge: 300000 });
      return res.status(201).json({
        signUpRequest: "success",
        payloadToken,
        otpToken,
      });
    });
  } catch (err) {
    res.status(500);
    res.json(err);
    res.end();
    return err;
  }
}
export async function signUpHandler(req: Request, res: Response) {
  const { otp } = req.body;
  if (!otp) {
    res.status(401).json({ err: "otp not provided" });
    return;
  }

  // const payloadToken: string | undefined = req.headers.payloadToken?.toString();
  // const otpToken: string | undefined = req.headers.otpToken?.toString();

  const payloadToken: string | undefined = req.cookies.payloadToken?.toString(); // cookies
  const otpToken: string | undefined = req.cookies.otpToken?.toString();

  if (!payloadToken || !otpToken) {
    res.status(401);
    return;
  }
  try {
    const generatedOtp = await jwtverify_OTP(otpToken);
    if (!generatedOtp) {
      res.status(401);
      res.json({ err: "otpvalidation err" });
      res.end();
      return;
    }
    if (generatedOtp !== otp) {
      res.status(404);
      res.json({
        err: "Incorrect OTP provided",
      });
      res.end();
      return;
    }
    const new_User = await jwtverifySignUptToken(payloadToken);
    if (!new_User) {
      res.status(500);
      res.json({ err: "verification err" });
      res.end();
      return;
    }

    const user = await db
      .insert(LandlordTable)
      .values({
        name: new_User.name as string,
        username: uid.rnd() as string,
        email: new_User.email as string,
        password: new_User.hashedPassword as string,
        address: new_User.address as string,
      })
      .returning({
        id: LandlordTable.id,
      });
    const token = await jwtgenerate(user[0].id);

    res.cookie("Token", token);
    res.json({ signup: true, token: token });
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
}
export async function logInHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403);
    res.json({ err: "Missing required parameter" });
    res.end();
    return;
  }
  try {
    const user = await db
      .selectDistinct()
      .from(LandlordTable)
      .where(eq(LandlordTable.email, email));

    const userAccess = await comparePassword(password, user[0].password);

    if (!userAccess) {
      res.status(400);
      res.json({ err: "Invalid password" });
      res.end();
      return;
    }

    const token = await jwtgenerate(user[0].id);
    res.cookie("Token", token);
    res.status(200).json({ login: "sucess", token: token });
    return;
  } catch (err) {
    res.status(501).json({ err: "Invalid Email" });
    return;
  }
}
export const addtenantHandler = async (req: Request, res: Response) => {
  const {
    fullname,
    permanentaddress,
    document,
    documentnumber,
    livingspacetype,
    livingspacenumber,
  }: addTenantType = req.body;
  if (
    !fullname ||
    !permanentaddress ||
    !document ||
    !documentnumber ||
    !livingspacetype ||
    !livingspacenumber
  ) {
    res.status(404);
    res.json({ error: "invalid requires parameter" });
    res.end();
    return;
  }
  const generatedspaceid = await generatespaceId(
    livingspacetype,
    livingspacenumber
  );
  const generateddocid = await generateddocId(document, documentnumber);

  const tenantsData = await db
    .select()
    .from(TenantTable)
    .where(
      sql`${TenantTable.generateddocid} = ${generateddocid} AND ${TenantTable.generatedspaceid} = ${generatedspaceid}`
    );

  if (tenantsData.length !== 0) {
    res.status(404);
    res.json({ error: "Duplicate information " });
    res.end();
    return;
  }
  // console.log(
  //   fullname,
  //   permanentaddress,
  //   document,
  //   documentnumber,
  //   livingspacetype,
  //   livingspacenumber,
  //   generateddocid,
  //   generatedspaceid,
  //   req.id
  // );

  const newTenant = await db
    .insert(TenantTable)
    .values({
      fullname: fullname as string,
      permanentaddress: permanentaddress as string,
      document: document as DocumentType,
      documentnumber: documentnumber as string,
      livingspacetype: livingspacetype as SpaceType,
      livingspacenumber: livingspacenumber as string,
      generateddocid: generateddocid as string,
      generatedspaceid: generatedspaceid as string,
      landlordid: req.id as string,
    })
    .returning({
      id: TenantTable.id,
      generateddocid: TenantTable.generateddocid, //as password
      generatedspaceid: TenantTable.generatedspaceid, //as username
    });

  res.status(201);
  res.json({
    AddTenant: "Sucess",
    userId: "generatedspaceid",
    password: "generateddocid",
    generatedspaceid: generatedspaceid,
    generateddocid: generateddocid,
  });
  res.end();
  return;
};
export const alltenantHandler = async (req: Request, res: Response) => {
  const Userid = req.id;
  if (!Userid) {
    res.status(400);
    res.json({ err: "unauthorized" });
    res.end();
    return;
  }
  console.log(Userid);
  try {
    const user = await db
      .select()
      .from(TenantTable)
      .where(eq(TenantTable.landlordid, Userid));
    console.log(user);
    if (user.length === 0) {
      res.status(200);
      res.json({ msg: "You have no tenant" });
      res.end();
      return;
    }
    res.status(200);
    res.json({ user });
    res.end();
    return;
  } catch (err) {
    res.status(500);
    res.json({ err: "Invalid" });
    res.end();
    return;
  }
};
export const tenantHandler = async (req: Request, res: Response) => {
  const Userid = req.params["id"];

  try {
    const user = await db
      .select()
      .from(TenantTable)
      .where(eq(TenantTable.generatedspaceid, Userid));
    if (!user) {
      res.status(400);
      res.json({ err: "usernot found" });
      res.end();
      return;
    }
    res.status(200);
    res.json({ sucess: true, user });
    res.end();
    return;
  } catch (err) {
    res.status(500);
    res.json({ err: err });
    res.end();
    return;
  }
};
export const deletetenantHandler = async (req: Request, res: Response) => {
  const Userid = req.params["id"];
  try {
    const user = await db
      .select()
      .from(TenantTable)
      .where(eq(TenantTable.generatedspaceid, Userid));

    if (user.length === 0) {
      res.status(400);
      res.json({ error: "tenant not exist" });
      res.end();
      return;
    }

    if (user[0].landlordid !== req.id) {
      res.status(400);
      res.json({ error: "Unauthorized action!" });
      res.end();
      return;
    }
    const deletedtenant = await db
      .delete(TenantTable)
      .where(eq(TenantTable.generatedspaceid, Userid));
    console.log(deletedtenant);

    res.status(200);
    res.json({
      deletedtenant: "sucess",
      fullname: user[0].fullname,
      username: user[0].generatedspaceid,
    });
    res.end();
    return;
  } catch (err) {
    res.status(502);
    res.json({ error: "" });
    res.end();
    return;
  }
};
