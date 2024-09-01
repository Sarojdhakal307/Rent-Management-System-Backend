import { pgEnum } from "drizzle-orm/pg-core";

export type Role = "superAdmin" | "tenant" | "landlord";
export type DocumentType = "passport" | "citizen" | "id";
export type SpaceType = "flat" | "room";

export interface signUpReqType{
    name: string,
    email:string,
    hashedPassword:string,
    address:string

}
// const { name, email, password, address } = await req.body;