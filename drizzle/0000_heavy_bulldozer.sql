DO $$ BEGIN
 CREATE TYPE "public"."docType" AS ENUM('passport', 'citizen', 'id');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('superAdmin', 'tenant', 'landlord');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."spacetypeEnum" AS ENUM('flat', 'room');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "landlord" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"address" varchar NOT NULL,
	"role" "role" DEFAULT 'landlord' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "landlord_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullname" varchar NOT NULL,
	"role" "role" DEFAULT 'tenant' NOT NULL,
	"document" "docType" NOT NULL,
	"documentnumber" varchar NOT NULL,
	"livingspacetype" "spacetypeEnum" NOT NULL,
	"livingspacenumber" varchar NOT NULL,
	"landlord_id" uuid NOT NULL,
	"generatespaceId" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_generatespaceId_unique" UNIQUE("generatespaceId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant" ADD CONSTRAINT "tenant_landlord_id_landlord_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."landlord"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
