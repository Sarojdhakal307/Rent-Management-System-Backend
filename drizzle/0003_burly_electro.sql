ALTER TABLE "tenant" ADD COLUMN "address" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant" ADD COLUMN "generatedDocumentId" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_generatedDocumentId_unique" UNIQUE("generatedDocumentId");