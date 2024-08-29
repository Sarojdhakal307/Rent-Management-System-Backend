import {
  pgTable,
  integer,
  varchar,
  uuid,
  timestamp,
  pgEnum
} from "drizzle-orm/pg-core";
// import { roleEnum } from "../types";

export const roleEnum = pgEnum("role", ["superAdmin", "tenant", "landlord"]);

const userScheme = pgTable("UserTable", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  age: integer("age"),
  phone: integer("phone"),
});

const adminSchema = pgTable("AdminTable", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  address: varchar("address").notNull(),
  role: roleEnum("role").default("landlord").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export { userScheme ,adminSchema};
