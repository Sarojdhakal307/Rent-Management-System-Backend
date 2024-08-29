import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DB_URL,
});

client
  .connect()
  .then(() => console.log("DB connected successfully."))
  .catch((e) => console.log(`error: ${e.message}`));

const db = drizzle(client);
export { db };
