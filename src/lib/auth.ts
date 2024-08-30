import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

require("dotenv").config();

export const hashPassword = async (password: string) => {
  if (!process.env.PASSWORD_SALT) {
    console.log("invalide salt");
    return;
  }
  const salt = parseInt(process.env.PASSWORD_SALT);
  return await bcrypt.hash(password, salt) as string;
};

export const comparePassword = async (
  password: string,
  hashedpassword: string
) => {
  console.log("compare password");
  return await bcrypt.compare(password, hashedpassword) as boolean;
};

export const jwtgenerate = async (id: string) => {
  if (!process.env.JWT_KEY) {
    console.log("Invalide JWT_KEY");
    return;
  }
  return await jwt.sign(id, process.env.JWT_KEY) as string;
};
