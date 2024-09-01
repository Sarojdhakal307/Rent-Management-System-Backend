ALTER TABLE "tenant" RENAME COLUMN "landlord_id" TO "landlordid";--> statement-breakpoint
ALTER TABLE "tenant" DROP CONSTRAINT "tenant_landlord_id_landlord_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant" ADD CONSTRAINT "tenant_landlordid_landlord_id_fk" FOREIGN KEY ("landlordid") REFERENCES "public"."landlord"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
