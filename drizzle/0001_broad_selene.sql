DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('superAdmin', 'tenant', 'landlord');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"address" varchar NOT NULL,
	"role" "role" DEFAULT 'landlord' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AdminTable_email_unique" UNIQUE("email")
);
