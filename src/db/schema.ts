import { pgTable, integer, varchar, uuid } from "drizzle-orm/pg-core";

const userScheme = pgTable("UserTable", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  age: integer("age"),
  phone: integer("phone"),
});

export { userScheme };