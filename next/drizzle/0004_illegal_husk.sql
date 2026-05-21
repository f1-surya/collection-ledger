DROP INDEX "member_org_idx";--> statement-breakpoint
DROP INDEX "org_slug_idx";--> statement-breakpoint
DROP INDEX "session_userid_idx";--> statement-breakpoint
DROP INDEX "session_token_idx";--> statement-breakpoint
DROP INDEX "user_email_idx";--> statement-breakpoint
DROP INDEX "connection_boxNumber_index";--> statement-breakpoint
DROP INDEX "payments_date_index";--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "items" jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "connection_org_boxNumber_index" ON "connection" USING btree ("org","boxNumber");--> statement-breakpoint
CREATE INDEX "connection_org_name_index" ON "connection" USING btree ("org","name");--> statement-breakpoint
CREATE INDEX "connection_name_trgm_idx" ON "connection" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "connection_boxnumber_trgm_idx" ON "connection" USING gin ("boxNumber" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "payments_org_date_index" ON "payments" USING btree ("org","date");