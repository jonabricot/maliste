CREATE TABLE "ideas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ideas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"link" text,
	"participants" varchar(255)[],
	"listId" uuid,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"participants" varchar(255)[],
	"authorId" uuid,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"token" uuid DEFAULT gen_random_uuid(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_listId_lists_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;