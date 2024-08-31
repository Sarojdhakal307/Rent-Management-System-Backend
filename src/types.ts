import { pgEnum } from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("role", ["superAdmin", "tenant", "landlord"]);

export interface signUpReqType{
    name: string,
    email:string,
    hashedPassword:string,
    address:string

}
// const { name, email, password, address } = await req.body;