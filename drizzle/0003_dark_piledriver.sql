ALTER TABLE "AdminTable" RENAME TO "admin";--> statement-breakpoint
ALTER TABLE "admin" DROP CONSTRAINT "AdminTable_email_unique";--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_email_unique" UNIQUE("email");