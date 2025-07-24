import { pgEnum } from "drizzle-orm/pg-core";

export type Role = "superAdmin" | "tenant" | "landlord";
export type DocumentType = "passport" | "citizen" | "id";
export type SpaceType = "flat" | "room";

export interface signUpReqType {
  name: string;
  email: string;
  hashedPassword: string;
  address: string;
}

export interface addTenantType {
  fullname: string;
  permanentaddress: string;
  document: DocumentType;
  documentnumber: string;
  livingspacetype: SpaceType;
  livingspacenumber: string;
  generateddocid: string;
  generatedspaceid: string;
}
export interface UserPayload_token  {
  id: string ;
  role: Role;
  
};
// const { name, email, password, address } = await req.body;
