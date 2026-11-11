CREATE TABLE "participant" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "participant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"listId" uuid,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "participant_to_idea" (
	"ideaId" integer,
	"participantId" integer,
	CONSTRAINT "participant_to_idea_pkey" PRIMARY KEY("ideaId","participantId")
);
--> statement-breakpoint
CREATE TABLE "user_to_participant" (
	"userId" text,
	"participantId" integer,
	CONSTRAINT "user_to_participant_pkey" PRIMARY KEY("userId","participantId")
);
--> statement-breakpoint
ALTER TABLE "idea" DROP COLUMN "participants";--> statement-breakpoint
ALTER TABLE "idea" DROP COLUMN "authorName";--> statement-breakpoint
ALTER TABLE "list" DROP COLUMN "participants";--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_listId_list_id_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id");--> statement-breakpoint
ALTER TABLE "participant_to_idea" ADD CONSTRAINT "participant_to_idea_ideaId_idea_id_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id");--> statement-breakpoint
ALTER TABLE "participant_to_idea" ADD CONSTRAINT "participant_to_idea_participantId_participant_id_fkey" FOREIGN KEY ("participantId") REFERENCES "participant"("id");--> statement-breakpoint
ALTER TABLE "user_to_participant" ADD CONSTRAINT "user_to_participant_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "user_to_participant" ADD CONSTRAINT "user_to_participant_participantId_participant_id_fkey" FOREIGN KEY ("participantId") REFERENCES "participant"("id");