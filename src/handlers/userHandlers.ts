import { Request, Response } from "express";
import { eq, lt, gte, ne } from "drizzle-orm";

import { db } from "../db/db_connect";
import { AdminTable } from "../db/schema";
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
import { transporter, signUpMailOTP, generateOTP } from "../lib/mailServices";
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

    console.log("ValidMailFlag : ", validMailFlag);
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
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
      .insert(AdminTable)
      .values({
        name: new_User.name as string,
        username: uid.rnd() as string,
        email: new_User.email as string,
        password: new_User.hashedPassword as string,
        address: new_User.address as string,
      })
      .returning({
        id: AdminTable.id,
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
      .from(AdminTable)
      .where(eq(AdminTable.email, email));

    const userAccess = await comparePassword(password, user[0].password);

    if (!userAccess) {
      res.status(400)
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
