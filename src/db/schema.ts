// import { computed } from "drizzle-orm/mysql-core";\
import { SQL, sql } from "drizzle-orm"
import {
  pgTable,
  integer,
  varchar,
  uuid,
  timestamp,
  pgEnum,
  AnyPgColumn,
  uniqueIndex,
  // sql,
  // SQL
} from "drizzle-orm/pg-core";
import { generatespaceId } from "../lib/lib";

export const roleEnum = pgEnum("role", ["superAdmin", "tenant", "landlord"]);
export const docEnum = pgEnum("docType", ["passport", "citizen", "id"]);
export const spacetypeEnum = pgEnum("spacetypeEnum", ["flat", "room"]);



const LandlordTable = pgTable("landlord", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name").notNull(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  address: varchar("address").notNull(),
  role: roleEnum("role").default("landlord").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const TenantTable = pgTable(
  "tenant",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    fullname: varchar("fullname").notNull(),
    role: roleEnum("role").default("tenant").notNull(),
    permanentaddress: varchar("permanentaddress").notNull(),
    document: docEnum("document").notNull(),
    documentnumber: varchar("documentnumber").notNull(),
    livingspacetype: spacetypeEnum("livingspacetype").notNull(),
    livingspacenumber: varchar("livingspacenumber").notNull(),
    landlordid: uuid("landlordid").notNull().references(() => LandlordTable.id, { onDelete: 'cascade' }),
    generatedspaceid:varchar("generatedspaceId").notNull().unique(),
    generateddocid: varchar("generatedDocumentId").notNull().unique(),
    // generatedspaceid: varchar("generatedspaceid").generatedAlwaysAs(
    //   (): SQL => sql`${TenantTable.livingspacetype} || '-' || ${TenantTable.livingspace_number}`
    // ).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
  
);

export {  LandlordTable, TenantTable };
