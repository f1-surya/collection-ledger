CREATE TABLE "base_packs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lcoPrice" integer NOT NULL,
	"customerPrice" integer NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connection" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"boxNumber" text NOT NULL,
	"phoneNumber" text,
	"area" text NOT NULL,
	"basePack" text NOT NULL,
	"org" text NOT NULL,
	"lastPayment" timestamp with time zone,
	"createdAt" timestamp DEFAULT now(),
	"updateddAt" timestamp DEFAULT now(),
	CONSTRAINT "connection_boxNumber_unique" UNIQUE("boxNumber")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"connection" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"to" text,
	"currentPack" text NOT NULL,
	"isMigration" boolean DEFAULT false NOT NULL,
	"lcoPrice" integer NOT NULL,
	"customerPrice" integer NOT NULL,
	"org" text NOT NULL
);
--> statement-breakpoint
DROP INDEX "org_index";--> statement-breakpoint
ALTER TABLE "areas" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "base_packs" ADD CONSTRAINT "base_packs_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_area_areas_id_fk" FOREIGN KEY ("area") REFERENCES "public"."areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_basePack_base_packs_id_fk" FOREIGN KEY ("basePack") REFERENCES "public"."base_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_org_organization_id_fk" FOREIGN KEY ("org") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_connection_connection_id_fk" FOREIGN KEY ("connection") REFERENCES "public"."connection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_to_base_packs_id_fk" FOREIGN KEY ("to") REFERENCES "public"."base_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_currentPack_base_packs_id_fk" FOREIGN KEY ("currentPack") REFERENCES "public"."base_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_org_organization_id_fk" FOREIGN KEY ("org") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_base_pack_index" ON "base_packs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "connection_org_index" ON "connection" USING btree ("org");--> statement-breakpoint
CREATE INDEX "connection_id_index" ON "connection" USING btree ("id");--> statement-breakpoint
CREATE INDEX "connection_boxNumber_index" ON "connection" USING btree ("boxNumber");--> statement-breakpoint
CREATE INDEX "payments_date_index" ON "payments" USING btree ("date");--> statement-breakpoint
CREATE INDEX "payments_connection_index" ON "payments" USING btree ("connection");--> statement-breakpoint
CREATE INDEX "payments_org_index" ON "payments" USING btree ("org");--> statement-breakpoint
CREATE INDEX "payments_monthly_check_idx" ON "payments" USING btree ("connection","org","date");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_org_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "org_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_userid_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "org_area_index" ON "areas" USING btree ("organization_id");