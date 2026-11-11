CREATE TABLE "shared_list" (
	"listId" uuid,
	"userId" text,
	CONSTRAINT "shared_list_pkey" PRIMARY KEY("listId","userId")
);
--> statement-breakpoint
ALTER TABLE "shared_list" ADD CONSTRAINT "shared_list_listId_list_id_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id");--> statement-breakpoint
ALTER TABLE "shared_list" ADD CONSTRAINT "shared_list_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id");