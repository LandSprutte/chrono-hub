CREATE TABLE `invitations` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`organization_id` integer NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`accepted_at` integer
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` text;--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_email_unique` ON `invitations` (`email`);