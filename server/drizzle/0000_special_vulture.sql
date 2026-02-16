CREATE TABLE `batchContentItems` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`projectId` int NOT NULL,
	`contentId` int,
	`contentType` enum('long_form_article','social_post','newsletter','video_script','infographic','podcast_script','presentation') NOT NULL,
	`platform` varchar(64) NOT NULL,
	`title` varchar(512),
	`body` text,
	`hashtags` json,
	`mediaUrls` json,
	`scheduledFor` timestamp,
	`status` enum('pending_generation','generated','pending_review','approved','scheduled','published','failed') NOT NULL DEFAULT 'pending_generation',
	`reviewNotes` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`publishedAt` timestamp,
	`publishedUrl` varchar(512),
	`postId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `batchContentItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `batchPublishingCampaigns` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`clientProfileId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`period` enum('weekly','biweekly','monthly','quarterly') DEFAULT 'monthly',
	`startDate` timestamp,
	`endDate` timestamp,
	`topic` text,
	`contentBrief` text,
	`targetPlatforms` json,
	`contentPlan` json,
	`status` enum('draft','pending_approval','approved','in_progress','completed','cancelled') NOT NULL DEFAULT 'draft',
	`approvedBy` int,
	`approvedAt` timestamp,
	`totalContent` int DEFAULT 0,
	`generatedContent` int DEFAULT 0,
	`publishedContent` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `batchPublishingCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `claudeSkills` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`triggerPhrase` varchar(500),
	`skillType` enum('content_generation','batch_publishing','engagement','analytics','profile_update','custom') NOT NULL,
	`systemPrompt` text,
	`parameters` json,
	`actions` json,
	`schedule` json,
	`requiresApproval` boolean NOT NULL DEFAULT true,
	`approvalType` enum('none','before_generation','before_publishing','both') DEFAULT 'before_publishing',
	`isGlobal` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `claudeSkills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientPlatformAccounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`profileUrl` varchar(512),
	`username` varchar(255),
	`displayName` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`platformConfig` json,
	`lastPublishedAt` timestamp,
	`lastCheckedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientPlatformAccounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientProfiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`displayName` varchar(255),
	`email` varchar(255),
	`title` varchar(255),
	`company` varchar(255),
	`industry` varchar(128),
	`shortBio` text,
	`bio` text,
	`keywords` json,
	`topics` json,
	`toneOfVoice` text,
	`contentGuidelines` text,
	`targetAudience` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`contentType` enum('article','social_post','newsletter','video_script','image_caption','seo_content') NOT NULL,
	`platform` varchar(64),
	`title` varchar(512),
	`body` text,
	`hashtags` json,
	`mediaUrls` json,
	`seoKeywords` json,
	`status` enum('draft','pending','approved','published','archived') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`publishedUrl` varchar(512),
	`postId` varchar(255),
	`engagementMetrics` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentTemplates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`templateType` enum('social_post','blog_article','newsletter','video_script','linkedin_article','twitter_thread','instagram_caption') NOT NULL,
	`platform` varchar(64),
	`promptTemplate` text NOT NULL,
	`exampleOutput` text,
	`variables` json,
	`aiModel` varchar(64),
	`maxTokens` int,
	`temperature` int,
	`isGlobal` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engagementActions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`actionType` enum('like','comment','follow','share','reply') NOT NULL,
	`targetPostId` varchar(255),
	`targetUserId` varchar(255),
	`generatedContent` text,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `engagementActions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engagementCampaigns` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` varchar(64) NOT NULL,
	`targetType` enum('hashtag','user','keyword','competitor') NOT NULL,
	`targets` json,
	`actions` json,
	`dailyLimits` json,
	`schedule` json,
	`brandVoice` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `engagementCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`prompt` text,
	`imageUrl` varchar(512),
	`thumbnailUrl` varchar(512),
	`style` varchar(64),
	`dimensions` varchar(64),
	`status` enum('generating','completed','failed') NOT NULL DEFAULT 'generating',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformCredentials` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`credentialType` enum('api_key','oauth','password','cookie','token') NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`apiKey` text,
	`apiSecret` text,
	`username` varchar(255),
	`password` text,
	`cookies` text,
	`profileUrl` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`lastValidated` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformCredentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`clientName` varchar(255),
	`targetKeyword` varchar(255),
	`brandVoice` text,
	`industry` varchar(128),
	`status` enum('active','paused','completed','archived') NOT NULL DEFAULT 'active',
	`settings` json,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduledPosts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`contentId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`status` enum('pending','published','failed','cancelled') NOT NULL DEFAULT 'pending',
	`publishedAt` timestamp,
	`error` text,
	`retryCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scheduledPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taskSteps` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`stepNumber` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`platform` varchar(64),
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`input` json,
	`output` json,
	`error` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taskSteps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`prompt` text NOT NULL,
	`parsedAction` json,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`result` text,
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`isActive` boolean NOT NULL DEFAULT true,
	`lastLoginAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `batchContentItems` ADD CONSTRAINT `batchContentItems_campaignId_batchPublishingCampaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `batchPublishingCampaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batchContentItems` ADD CONSTRAINT `batchContentItems_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batchContentItems` ADD CONSTRAINT `batchContentItems_contentId_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batchPublishingCampaigns` ADD CONSTRAINT `batchPublishingCampaigns_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batchPublishingCampaigns` ADD CONSTRAINT `batchPublishingCampaigns_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `claudeSkills` ADD CONSTRAINT `claudeSkills_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clientPlatformAccounts` ADD CONSTRAINT `clientPlatformAccounts_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clientProfiles` ADD CONSTRAINT `clientProfiles_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content` ADD CONSTRAINT `content_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentTemplates` ADD CONSTRAINT `contentTemplates_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `engagementActions` ADD CONSTRAINT `engagementActions_campaignId_engagementCampaigns_id_fk` FOREIGN KEY (`campaignId`) REFERENCES `engagementCampaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `engagementCampaigns` ADD CONSTRAINT `engagementCampaigns_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `platformCredentials` ADD CONSTRAINT `platformCredentials_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduledPosts` ADD CONSTRAINT `scheduledPosts_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduledPosts` ADD CONSTRAINT `scheduledPosts_contentId_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `taskSteps` ADD CONSTRAINT `taskSteps_taskId_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;