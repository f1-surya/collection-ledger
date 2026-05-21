CREATE TABLE "addons" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lcoPrice" integer NOT NULL,
	"customerPrice" integer NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connection_addons" (
	"id" text PRIMARY KEY NOT NULL,
	"connectionId" text NOT NULL,
	"addonId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "addons" ADD CONSTRAINT "addons_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_addons" ADD CONSTRAINT "connection_addons_connectionId_connection_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."connection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_addons" ADD CONSTRAINT "connection_addons_addonId_addons_id_fk" FOREIGN KEY ("addonId") REFERENCES "public"."addons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_addons_index" ON "addons" USING btree ("organization_id");