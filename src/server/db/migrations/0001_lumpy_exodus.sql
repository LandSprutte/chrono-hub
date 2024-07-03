CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`database_name` text NOT NULL,
	`database_auth_token` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `organization_id` integer;