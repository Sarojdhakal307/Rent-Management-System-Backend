import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signUpReqType,UserPayload_token } from "../types";

require("dotenv").config();

export const hashPassword = async (password: string) => {
  if (!process.env.PASSWORD_SALT) {
    console.log("invalide salt");
    return;
  }
  const salt = parseInt(process.env.PASSWORD_SALT);
  return (await bcrypt.hash(password, salt)) as string;
};

export const comparePassword = async (
  password: string,
  hashedpassword: string
) => {
  console.log("compare password");
  return (await bcrypt.compare(password, hashedpassword)) as boolean;
};

export const jwtgenerate = async (obj:any) => {
  if (!process.env.JWT_KEY) {
    console.log("Invalide JWT_KEY");
    return;
  }
  return (await jwt.sign(obj, process.env.JWT_KEY)) as string;
};

export const jwtverify  = async (token: string): Promise<UserPayload_token | undefined>=>{
  if (!process.env.JWT_KEY) {
    return;
  }
  return await jwt.verify(token, process.env.JWT_KEY) as UserPayload_token;
};

export const jwtgenerateSignUptToken = async (payload: signUpReqType) => {
  if (!process.env.JWT_KEY) {
    console.log("Invalide JWT_KEY");
    return;
  }
  return (await jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "2m",
  })) as string;
};

export const jwtverifySignUptToken = async (token: string) => {
  if (!process.env.JWT_KEY) {
    return;
  }
  return (await jwt.verify(token, process.env.JWT_KEY)) as signUpReqType;
};
export const jwtgenerate_OTP = async (id: string) => {
  if (!process.env.JWT_KEY) {
    console.log("Invalide JWT_KEY");
    return "";
  }
  return (await jwt.sign(id, process.env.JWT_KEY)) as string;
};

export const jwtverify_OTP = async (token: string) => {
  if (!process.env.JWT_KEY) {
    return;
  }
  return await jwt.verify(token, process.env.JWT_KEY);
};
