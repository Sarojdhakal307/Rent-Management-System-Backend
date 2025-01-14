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

import {
  addTenantType,
  Role,
  DocumentType,
  SpaceType,
  UserPayload_token,
} from "./../types";
import { transporter, signUpMailOTP, generateOTP } from "../lib/mailServices";
import { generateddocId, generatespaceId } from "../lib/lib";

import ShortUniqueId from "short-unique-id";

import validator from "validator";

const uid = new ShortUniqueId();

export async function signupRequestHandler(req: Request, res: Response) {
  const { name, email, password, address } = await req.body;

  if (!name || !email || !password || !address) {
    return res
      .status(401)
      .json({ success: false, message: "Missing required parameter" });
  }
  try {
    const validMailFlag = validator.isEmail(email); //formate validation
    if (!validMailFlag) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    const user = await db
      .select()
      .from(LandlordTable)
      .where(eq(LandlordTable.email, email));

    if (user.length !== 0) {
      res.status(401);
      res.json({ success: false, message: "User already exist" });
      res.end();
      return;
    }

    // console.log("ValidMailFlag : ", validMailFlag);
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      console.log({ message: "passwordHash invalid err" });
      res.status(404);
      res.json({ success: false, message: "Try Again" });
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
    const otpToken = await hashPassword(OTP.toString());

    transporter.sendMail(signupOTP_MailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      res.cookie("payloadToken", payloadToken, { maxAge: 300000 }); // 300 seconds
      res.cookie("otpToken", otpToken, { maxAge: 300000 });
      return res.status(201).json({
        success: true,
        message: {
          payloadToken: payloadToken,
          otpToken: otpToken,
        },
      });
    });
  } catch (err) {
    res.status(500);
    res.json({ success: false, message: err });
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
    res.json({ success: false, message: "try again" });
    return;
  }
  try {
    const istrueOTP = await comparePassword(otp, otpToken);
    if (!istrueOTP) {
      res.status(404);
      res.json({
        success: false,
        message: "Incorrect OTP provided",
      });
      res.end();
      return;
    }
    const new_User = await jwtverifySignUptToken(payloadToken);
    if (!new_User) {
      res.status(500);
      res.json({ success: false, message: "verification error" });
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
        role: LandlordTable.role,
        username: LandlordTable.username,
      });
    const obj_payload: UserPayload_token = {
      id: user[0].id,
      role: user[0].role,
    };
    const token = await jwtgenerate(obj_payload);
    // const token = await jwtgenerate({user[0].id, user[0].role});

    res.cookie("Token", token);
    res.json({
      success: true,
      message: { token: token, username: user[0].username },
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err });
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
    const obj_payload: UserPayload_token = {
      id: user[0].id,
      role: user[0].role,
    };
    const token = await jwtgenerate(obj_payload);
    res.cookie("Token", token);
    res.status(200).json({ login: "sucess", token: token });
    return;
  } catch (err) {
    res.status(501).json({ err: "Invalid Email" });
    return;
  }
}
export async function changePasswordHandler(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400);
    res.json({ err: "Invalid required parameters" });
    res.end();
    return;
  }
  const UserId = req.id;
  if (!UserId) {
    res.status(400);
    res.json({ err: "Unauthorized" });
    res.end();
    return;
  }

  try {
    const user = await db
      .selectDistinct()
      .from(LandlordTable)
      .where(eq(LandlordTable.id, UserId));
    // const HashedOldPassword = await Has
    if (user.length === 0) {
      res.status(404);
      res.json({ err: "Unauthorized" });
      res.end();
      return;
    }
    // console.log(user)
    const passFlag = await comparePassword(oldPassword, user[0].password);
    if (!passFlag) {
      res.status(400);
      res.json({ err: "Invalid oldPassword" });
      res.end();
      return;
    }
    if (oldPassword === newPassword) {
      res.status(400);
      res.json({ err: "Newpassword and Oldpassword cant be same!" });
      res.end();
      return;
    }
    const hashedPassword = await hashPassword(newPassword);
    if (!hashedPassword) {
      res.status(400);
      res.end();
      return;
    }
    const updatedUser = await db
      .update(LandlordTable)
      .set({ password: hashedPassword })
      .where(eq(LandlordTable.id, UserId))
      .returning({ updatedId: LandlordTable.id });

    res.status(201);
    res.json({ updated: "sucess", updatedUser });
  } catch (err) {
    res.status(400);
    res.json({ err: err });
    res.end();
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
    if (user.length === 0) {
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
// export const updatetenantHandler=async(req:Request,res:Response)=>{
//   const Userid = req.params["id"];

//   try {
//     const user = await db
//       .selectDistinct()
//       .from(TenantTable)
//       .where(eq(TenantTable.generatedspaceid, Userid));
//     if (user.length === 0) {
//       res.status(400);
//       res.json({ err: "usernot found" });
//       res.end();
//       return;
//     };
//     res.json({ user });

//     return;

// }
// catch(err){

// }};

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

//tenantHandlers

export const logInTenantHandler = async (req: Request, res: Response) => {
  const { landlordUsername, spaceId, docId } = req.body;
  if (!landlordUsername && !spaceId && !docId) {
    res.status(403);
    res.json({ err: "Missing required parameter" });
    res.end();
    return;
  }
  try {
    const landLord = await db
      .select()
      .from(LandlordTable)
      .where(eq(LandlordTable.username, landlordUsername));
    if (!landLord.length) {
      res.status(400);
      res.json({ err: "Invalid LandlordUsername" });
      res.end();
      return;
    }
    // console.log(landLord);
    const tenants = await db
      .select()
      .from(TenantTable)
      .where(eq(TenantTable.landlordid, landLord[0].id));
    // console.log("tenants: " , tenants);
    if (!tenants.length) {
      res.status(400);
      res.json({ err: "invalid Tenant with this landlord" });
      res.end();
      return;
    }
    const userTenant = tenants.find((tenant) => {
      return (
        tenant.generatedspaceid === spaceId && tenant.generateddocid === docId
      );
    });
    // console.log(userTenant);

    if (!userTenant) {
      res.status(400);
      res.json({ err: "invalid Tenant with this landlord" });
      res.end();
      return;
    }

    const tenantPayload: UserPayload_token = {
      id: userTenant.id,
      role: userTenant.role,
    };
    const token = await jwtgenerate(tenantPayload);
    res.cookie("Token", token);
    res.status(200).json({ login: "sucess", token: token });
    res.end();
    return;
  } catch (err) {
    res.status(501).json({ err: "Invalid Email" });
    res.end();
    return;
  }
};

export const tenantprofileHandler = async (req: Request, res: Response) => {
  const userId = req?.id;
  if (!userId) {
    res.status(501).json({ err: "Invalid User" });
    res.end();
    return;
  }
  const user = await db
    .select()
    .from(TenantTable)
    .where(eq(TenantTable.id, userId));

  if (user.length === 0) {
    res.status(501).json({ err: "Invalid User" });
    res.end();
    return;
  }
  const { id, landlordid, createdAt, ...filteredTenant } = user[0];

  // console.log(filteredTenant);
  res.status(501).json({ userinfo: filteredTenant });
  res.end();
  return;
};

export const islogedinLandlord = async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies.Token;
  if (!token) {
    res.status(403).json({ success: false, message: "Invalid signature" });
    res.end();
    return;
  }
  try {
    const obj_payload: UserPayload_token | undefined | null = await jwtverify(
      token
    );
    if (obj_payload === undefined || !obj_payload.id) {
      res.status(403).json({ success: false, message: "Invalid signature" });
      res.end();
      return;
    }
    // console.log(obj_payload);
    // console.log(typeof(req.id))
    const user = await db
      .select()
      .from(LandlordTable)
      .where(eq(LandlordTable.id, obj_payload.id));

    if (
      user.length === 0 ||
      !obj_payload.role ||
      obj_payload.role !== "landlord"
    ) {
      res.status(404).json({ success: false, message: "Invalid signature" });
      res.end();
      return;
    }
    res.status(200).json({ success: true, message: "landlord" });
    res.end();
    return;
  } catch (err) {
    console.log({ error: err });
    res.status(403).json({ success: false, message: "Invalid signature" });
    res.end();
    return;
  }
};
