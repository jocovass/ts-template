CREATE SCHEMA "todo";
--> statement-breakpoint
CREATE TYPE "todo"."todo_status" AS ENUM('active', 'done', 'deleted');--> statement-breakpoint
CREATE TABLE "todo"."todos" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" "todo"."todo_status" DEFAULT 'active',
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
