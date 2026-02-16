
import {
    mysqlTable,
    serial,
    varchar,
    text,
    boolean,
    timestamp,
    json,
    mysqlEnum,
    int,
    index
} from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

// --- Users & Projects ---

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    role: mysqlEnum('role', ['admin', 'user']).default('user').notNull(),
    isActive: boolean('isActive').default(true).notNull(),
    lastLoginAt: timestamp('lastLoginAt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const projects = mysqlTable('projects', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    clientName: varchar('clientName', { length: 255 }),
    targetKeyword: varchar('targetKeyword', { length: 255 }),
    brandVoice: text('brandVoice'),
    industry: varchar('industry', { length: 128 }),
    status: mysqlEnum('status', ['active', 'paused', 'completed', 'archived']).default('active').notNull(),
    settings: json('settings'),
    userId: int('userId').references(() => users.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    clientProfiles: many(clientProfiles),
    content: many(content),
}));

// --- Client Profiles & Accounts ---

export const clientProfiles = mysqlTable('clientProfiles', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    displayName: varchar('displayName', { length: 255 }),
    email: varchar('email', { length: 255 }),
    title: varchar('title', { length: 255 }),
    company: varchar('company', { length: 255 }),
    industry: varchar('industry', { length: 128 }),
    shortBio: text('shortBio'),
    bio: text('bio'),
    keywords: json('keywords'), // string array
    topics: json('topics'), // string array
    toneOfVoice: text('toneOfVoice'),
    contentGuidelines: text('contentGuidelines'),
    targetAudience: text('targetAudience'),
    isActive: boolean('isActive').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const clientProfilesRelations = relations(clientProfiles, ({ one, many }) => ({
    project: one(projects, {
        fields: [clientProfiles.projectId],
        references: [projects.id],
    }),
    platformAccounts: many(clientPlatformAccounts),
    campaigns: many(batchPublishingCampaigns),
}));

export const clientPlatformAccounts = mysqlTable('clientPlatformAccounts', {
    id: serial('id').primaryKey(),
    clientProfileId: int('clientProfileId').references(() => clientProfiles.id).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    profileUrl: varchar('profileUrl', { length: 512 }),
    username: varchar('username', { length: 255 }),
    displayName: varchar('displayName', { length: 255 }),
    isActive: boolean('isActive').default(true).notNull(),
    platformConfig: json('platformConfig'),
    lastPublishedAt: timestamp('lastPublishedAt'),
    lastCheckedAt: timestamp('lastCheckedAt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const clientPlatformAccountsRelations = relations(clientPlatformAccounts, ({ one }) => ({
    clientProfile: one(clientProfiles, {
        fields: [clientPlatformAccounts.clientProfileId],
        references: [clientProfiles.id],
    }),
}));

export const platformCredentials = mysqlTable('platformCredentials', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    credentialType: mysqlEnum('credentialType', ['api_key', 'oauth', 'password', 'cookie', 'token']).notNull(),
    accessToken: text('accessToken'), // encrypted
    refreshToken: text('refreshToken'), // encrypted
    apiKey: text('apiKey'), // encrypted
    apiSecret: text('apiSecret'), // encrypted
    username: varchar('username', { length: 255 }),
    password: text('password'), // encrypted
    cookies: text('cookies'), // encrypted
    profileUrl: varchar('profileUrl', { length: 512 }),
    isActive: boolean('isActive').default(true).notNull(),
    expiresAt: timestamp('expiresAt'),
    lastValidated: timestamp('lastValidated'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

// --- Content & AI ---

export const content = mysqlTable('content', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    contentType: mysqlEnum('contentType', ['article', 'social_post', 'newsletter', 'video_script', 'image_caption', 'seo_content']).notNull(),
    platform: varchar('platform', { length: 64 }),
    title: varchar('title', { length: 512 }),
    body: text('body'),
    hashtags: json('hashtags'), // string array
    mediaUrls: json('mediaUrls'), // string array
    seoKeywords: json('seoKeywords'), // string array
    status: mysqlEnum('status', ['draft', 'pending', 'approved', 'published', 'archived']).default('draft').notNull(),
    scheduledAt: timestamp('scheduledAt'),
    publishedAt: timestamp('publishedAt'),
    publishedUrl: varchar('publishedUrl', { length: 512 }),
    postId: varchar('postId', { length: 255 }),
    engagementMetrics: json('engagementMetrics'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const contentRelations = relations(content, ({ one, many }) => ({
    project: one(projects, {
        fields: [content.projectId],
        references: [projects.id],
    }),
    scheduledPosts: many(scheduledPosts),
}));

export const images = mysqlTable('images', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    prompt: text('prompt'),
    imageUrl: varchar('imageUrl', { length: 512 }),
    thumbnailUrl: varchar('thumbnailUrl', { length: 512 }),
    style: varchar('style', { length: 64 }),
    dimensions: varchar('dimensions', { length: 64 }),
    status: mysqlEnum('status', ['generating', 'completed', 'failed']).default('generating').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const contentTemplates = mysqlTable('contentTemplates', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id), // nullable for global
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    templateType: mysqlEnum('templateType', ['social_post', 'blog_article', 'newsletter', 'video_script', 'linkedin_article', 'twitter_thread', 'instagram_caption']).notNull(),
    platform: varchar('platform', { length: 64 }),
    promptTemplate: text('promptTemplate').notNull(),
    exampleOutput: text('exampleOutput'),
    variables: json('variables'), // array of {name, description, required, defaultValue}
    aiModel: varchar('aiModel', { length: 64 }),
    maxTokens: int('maxTokens'),
    temperature: int('temperature'), // divide by 100
    isGlobal: boolean('isGlobal').default(false).notNull(),
    isActive: boolean('isActive').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const claudeSkills = mysqlTable('claudeSkills', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    triggerPhrase: varchar('triggerPhrase', { length: 500 }),
    skillType: mysqlEnum('skillType', ['content_generation', 'batch_publishing', 'engagement', 'analytics', 'profile_update', 'custom']).notNull(),
    systemPrompt: text('systemPrompt'),
    parameters: json('parameters'), // array definitions
    actions: json('actions'), // ordered actions
    schedule: json('schedule'),
    requiresApproval: boolean('requiresApproval').default(true).notNull(),
    approvalType: mysqlEnum('approvalType', ['none', 'before_generation', 'before_publishing', 'both']).default('before_publishing'),
    isGlobal: boolean('isGlobal').default(false).notNull(),
    isActive: boolean('isActive').default(true).notNull(),
    lastRunAt: timestamp('lastRunAt'),
    nextRunAt: timestamp('nextRunAt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

// --- Tasks & Scheduling ---

export const tasks = mysqlTable('tasks', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    prompt: text('prompt').notNull(),
    parsedAction: json('parsedAction'),
    status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed']).default('pending').notNull(),
    result: text('result'),
    error: text('error'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const taskSteps = mysqlTable('taskSteps', {
    id: serial('id').primaryKey(),
    taskId: int('taskId').references(() => tasks.id).notNull(),
    stepNumber: int('stepNumber').notNull(),
    action: varchar('action', { length: 128 }).notNull(),
    platform: varchar('platform', { length: 64 }),
    status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed']).default('pending').notNull(),
    input: json('input'),
    output: json('output'),
    error: text('error'),
    startedAt: timestamp('startedAt'),
    completedAt: timestamp('completedAt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const taskStepsRelations = relations(taskSteps, ({ one }) => ({
    task: one(tasks, {
        fields: [taskSteps.taskId],
        references: [tasks.id],
    }),
}));

export const scheduledPosts = mysqlTable('scheduledPosts', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    contentId: int('contentId').references(() => content.id).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    scheduledAt: timestamp('scheduledAt').notNull(),
    status: mysqlEnum('status', ['pending', 'published', 'failed', 'cancelled']).default('pending').notNull(),
    publishedAt: timestamp('publishedAt'),
    error: text('error'),
    retryCount: int('retryCount').default(0).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const scheduledPostsRelations = relations(scheduledPosts, ({ one }) => ({
    content: one(content, {
        fields: [scheduledPosts.contentId],
        references: [content.id],
    }),
    project: one(projects, {
        fields: [scheduledPosts.projectId],
        references: [projects.id],
    }),
}));


// --- Campaigns ---

export const batchPublishingCampaigns = mysqlTable('batchPublishingCampaigns', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    clientProfileId: int('clientProfileId').references(() => clientProfiles.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    period: mysqlEnum('period', ['weekly', 'biweekly', 'monthly', 'quarterly']).default('monthly'),
    startDate: timestamp('startDate'),
    endDate: timestamp('endDate'),
    topic: text('topic'),
    contentBrief: text('contentBrief'),
    targetPlatforms: json('targetPlatforms'),
    contentPlan: json('contentPlan'),
    status: mysqlEnum('status', ['draft', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled']).default('draft').notNull(),
    approvedBy: int('approvedBy'), // references user, but we'll leave as int for now
    approvedAt: timestamp('approvedAt'),
    totalContent: int('totalContent').default(0),
    generatedContent: int('generatedContent').default(0),
    publishedContent: int('publishedContent').default(0),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const batchContentItems = mysqlTable('batchContentItems', {
    id: serial('id').primaryKey(),
    campaignId: int('campaignId').references(() => batchPublishingCampaigns.id).notNull(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    contentId: int('contentId').references(() => content.id), // nullable if not yet generated
    contentType: mysqlEnum('contentType', ['long_form_article', 'social_post', 'newsletter', 'video_script', 'infographic', 'podcast_script', 'presentation']).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    title: varchar('title', { length: 512 }),
    body: text('body'),
    hashtags: json('hashtags'),
    mediaUrls: json('mediaUrls'),
    scheduledFor: timestamp('scheduledFor'),
    status: mysqlEnum('status', ['pending_generation', 'generated', 'pending_review', 'approved', 'scheduled', 'published', 'failed']).default('pending_generation').notNull(),
    reviewNotes: text('reviewNotes'),
    reviewedBy: int('reviewedBy'),
    reviewedAt: timestamp('reviewedAt'),
    publishedAt: timestamp('publishedAt'),
    publishedUrl: varchar('publishedUrl', { length: 512 }),
    postId: varchar('postId', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const batchContentItemsRelations = relations(batchContentItems, ({ one }) => ({
    campaign: one(batchPublishingCampaigns, {
        fields: [batchContentItems.campaignId],
        references: [batchPublishingCampaigns.id],
    }),
    content: one(content, {
        fields: [batchContentItems.contentId],
        references: [content.id],
    }),
}));

export const engagementCampaigns = mysqlTable('engagementCampaigns', {
    id: serial('id').primaryKey(),
    projectId: int('projectId').references(() => projects.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    targetType: mysqlEnum('targetType', ['hashtag', 'user', 'keyword', 'competitor']).notNull(),
    targets: json('targets'),
    actions: json('actions'),
    dailyLimits: json('dailyLimits'),
    schedule: json('schedule'),
    brandVoice: text('brandVoice'),
    isActive: boolean('isActive').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const engagementActions = mysqlTable('engagementActions', {
    id: serial('id').primaryKey(),
    campaignId: int('campaignId').references(() => engagementCampaigns.id).notNull(),
    platform: varchar('platform', { length: 64 }).notNull(),
    actionType: mysqlEnum('actionType', ['like', 'comment', 'follow', 'share', 'reply']).notNull(),
    targetPostId: varchar('targetPostId', { length: 255 }),
    targetUserId: varchar('targetUserId', { length: 255 }),
    generatedContent: text('generatedContent'),
    status: mysqlEnum('status', ['pending', 'completed', 'failed']).default('pending').notNull(),
    error: text('error'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

