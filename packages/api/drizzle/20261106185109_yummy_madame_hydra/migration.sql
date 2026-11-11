ALTER TABLE "idea" DROP CONSTRAINT "idea_authorId_user_id_fkey";--> statement-breakpoint
ALTER TABLE "idea" ALTER COLUMN "authorId" SET DATA TYPE integer USING "authorId"::integer;--> statement-breakpoint
ALTER TABLE "idea" ADD CONSTRAINT "idea_authorId_participant_id_fkey" FOREIGN KEY ("authorId") REFERENCES "participant"("id");