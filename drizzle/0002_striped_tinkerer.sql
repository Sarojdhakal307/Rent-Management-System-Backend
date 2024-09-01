ALTER TABLE "tenant" RENAME COLUMN "generatespaceId" TO "generatedspaceId";--> statement-breakpoint
ALTER TABLE "tenant" DROP CONSTRAINT "tenant_generatespaceId_unique";--> statement-breakpoint
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_generatedspaceId_unique" UNIQUE("generatedspaceId");