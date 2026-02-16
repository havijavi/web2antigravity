"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engagementActions = exports.engagementCampaigns = exports.batchContentItemsRelations = exports.batchContentItems = exports.batchPublishingCampaigns = exports.scheduledPostsRelations = exports.scheduledPosts = exports.taskStepsRelations = exports.taskSteps = exports.tasks = exports.claudeSkills = exports.contentTemplates = exports.images = exports.contentRelations = exports.content = exports.platformCredentials = exports.clientPlatformAccountsRelations = exports.clientPlatformAccounts = exports.clientProfilesRelations = exports.clientProfiles = exports.projectsRelations = exports.projects = exports.users = void 0;
var mysql_core_1 = require("drizzle-orm/mysql-core");
var drizzle_orm_1 = require("drizzle-orm");
// --- Users & Projects ---
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)('password', { length: 255 }).notNull(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    role: (0, mysql_core_1.mysqlEnum)('role', ['admin', 'user']).default('user').notNull(),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    lastLoginAt: (0, mysql_core_1.timestamp)('lastLoginAt'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.projects = (0, mysql_core_1.mysqlTable)('projects', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    clientName: (0, mysql_core_1.varchar)('clientName', { length: 255 }),
    targetKeyword: (0, mysql_core_1.varchar)('targetKeyword', { length: 255 }),
    brandVoice: (0, mysql_core_1.text)('brandVoice'),
    industry: (0, mysql_core_1.varchar)('industry', { length: 128 }),
    status: (0, mysql_core_1.mysqlEnum)('status', ['active', 'paused', 'completed', 'archived']).default('active').notNull(),
    settings: (0, mysql_core_1.json)('settings'),
    userId: (0, mysql_core_1.int)('userId').references(function () { return exports.users.id; }),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.projectsRelations = (0, drizzle_orm_1.relations)(exports.projects, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.users, {
            fields: [exports.projects.userId],
            references: [exports.users.id],
        }),
        clientProfiles: many(exports.clientProfiles),
        content: many(exports.content),
    });
});
// --- Client Profiles & Accounts ---
exports.clientProfiles = (0, mysql_core_1.mysqlTable)('clientProfiles', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    displayName: (0, mysql_core_1.varchar)('displayName', { length: 255 }),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }),
    company: (0, mysql_core_1.varchar)('company', { length: 255 }),
    industry: (0, mysql_core_1.varchar)('industry', { length: 128 }),
    shortBio: (0, mysql_core_1.text)('shortBio'),
    bio: (0, mysql_core_1.text)('bio'),
    keywords: (0, mysql_core_1.json)('keywords'), // string array
    topics: (0, mysql_core_1.json)('topics'), // string array
    toneOfVoice: (0, mysql_core_1.text)('toneOfVoice'),
    contentGuidelines: (0, mysql_core_1.text)('contentGuidelines'),
    targetAudience: (0, mysql_core_1.text)('targetAudience'),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.clientProfilesRelations = (0, drizzle_orm_1.relations)(exports.clientProfiles, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        project: one(exports.projects, {
            fields: [exports.clientProfiles.projectId],
            references: [exports.projects.id],
        }),
        platformAccounts: many(exports.clientPlatformAccounts),
        campaigns: many(exports.batchPublishingCampaigns),
    });
});
exports.clientPlatformAccounts = (0, mysql_core_1.mysqlTable)('clientPlatformAccounts', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    clientProfileId: (0, mysql_core_1.int)('clientProfileId').references(function () { return exports.clientProfiles.id; }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    profileUrl: (0, mysql_core_1.varchar)('profileUrl', { length: 512 }),
    username: (0, mysql_core_1.varchar)('username', { length: 255 }),
    displayName: (0, mysql_core_1.varchar)('displayName', { length: 255 }),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    platformConfig: (0, mysql_core_1.json)('platformConfig'),
    lastPublishedAt: (0, mysql_core_1.timestamp)('lastPublishedAt'),
    lastCheckedAt: (0, mysql_core_1.timestamp)('lastCheckedAt'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.clientPlatformAccountsRelations = (0, drizzle_orm_1.relations)(exports.clientPlatformAccounts, function (_a) {
    var one = _a.one;
    return ({
        clientProfile: one(exports.clientProfiles, {
            fields: [exports.clientPlatformAccounts.clientProfileId],
            references: [exports.clientProfiles.id],
        }),
    });
});
exports.platformCredentials = (0, mysql_core_1.mysqlTable)('platformCredentials', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    credentialType: (0, mysql_core_1.mysqlEnum)('credentialType', ['api_key', 'oauth', 'password', 'cookie', 'token']).notNull(),
    accessToken: (0, mysql_core_1.text)('accessToken'), // encrypted
    refreshToken: (0, mysql_core_1.text)('refreshToken'), // encrypted
    apiKey: (0, mysql_core_1.text)('apiKey'), // encrypted
    apiSecret: (0, mysql_core_1.text)('apiSecret'), // encrypted
    username: (0, mysql_core_1.varchar)('username', { length: 255 }),
    password: (0, mysql_core_1.text)('password'), // encrypted
    cookies: (0, mysql_core_1.text)('cookies'), // encrypted
    profileUrl: (0, mysql_core_1.varchar)('profileUrl', { length: 512 }),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    expiresAt: (0, mysql_core_1.timestamp)('expiresAt'),
    lastValidated: (0, mysql_core_1.timestamp)('lastValidated'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
// --- Content & AI ---
exports.content = (0, mysql_core_1.mysqlTable)('content', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    contentType: (0, mysql_core_1.mysqlEnum)('contentType', ['article', 'social_post', 'newsletter', 'video_script', 'image_caption', 'seo_content']).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }),
    title: (0, mysql_core_1.varchar)('title', { length: 512 }),
    body: (0, mysql_core_1.text)('body'),
    hashtags: (0, mysql_core_1.json)('hashtags'), // string array
    mediaUrls: (0, mysql_core_1.json)('mediaUrls'), // string array
    seoKeywords: (0, mysql_core_1.json)('seoKeywords'), // string array
    status: (0, mysql_core_1.mysqlEnum)('status', ['draft', 'pending', 'approved', 'published', 'archived']).default('draft').notNull(),
    scheduledAt: (0, mysql_core_1.timestamp)('scheduledAt'),
    publishedAt: (0, mysql_core_1.timestamp)('publishedAt'),
    publishedUrl: (0, mysql_core_1.varchar)('publishedUrl', { length: 512 }),
    postId: (0, mysql_core_1.varchar)('postId', { length: 255 }),
    engagementMetrics: (0, mysql_core_1.json)('engagementMetrics'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.contentRelations = (0, drizzle_orm_1.relations)(exports.content, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        project: one(exports.projects, {
            fields: [exports.content.projectId],
            references: [exports.projects.id],
        }),
        scheduledPosts: many(exports.scheduledPosts),
    });
});
exports.images = (0, mysql_core_1.mysqlTable)('images', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    prompt: (0, mysql_core_1.text)('prompt'),
    imageUrl: (0, mysql_core_1.varchar)('imageUrl', { length: 512 }),
    thumbnailUrl: (0, mysql_core_1.varchar)('thumbnailUrl', { length: 512 }),
    style: (0, mysql_core_1.varchar)('style', { length: 64 }),
    dimensions: (0, mysql_core_1.varchar)('dimensions', { length: 64 }),
    status: (0, mysql_core_1.mysqlEnum)('status', ['generating', 'completed', 'failed']).default('generating').notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.contentTemplates = (0, mysql_core_1.mysqlTable)('contentTemplates', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }), // nullable for global
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    templateType: (0, mysql_core_1.mysqlEnum)('templateType', ['social_post', 'blog_article', 'newsletter', 'video_script', 'linkedin_article', 'twitter_thread', 'instagram_caption']).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }),
    promptTemplate: (0, mysql_core_1.text)('promptTemplate').notNull(),
    exampleOutput: (0, mysql_core_1.text)('exampleOutput'),
    variables: (0, mysql_core_1.json)('variables'), // array of {name, description, required, defaultValue}
    aiModel: (0, mysql_core_1.varchar)('aiModel', { length: 64 }),
    maxTokens: (0, mysql_core_1.int)('maxTokens'),
    temperature: (0, mysql_core_1.int)('temperature'), // divide by 100
    isGlobal: (0, mysql_core_1.boolean)('isGlobal').default(false).notNull(),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.claudeSkills = (0, mysql_core_1.mysqlTable)('claudeSkills', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    triggerPhrase: (0, mysql_core_1.varchar)('triggerPhrase', { length: 500 }),
    skillType: (0, mysql_core_1.mysqlEnum)('skillType', ['content_generation', 'batch_publishing', 'engagement', 'analytics', 'profile_update', 'custom']).notNull(),
    systemPrompt: (0, mysql_core_1.text)('systemPrompt'),
    parameters: (0, mysql_core_1.json)('parameters'), // array definitions
    actions: (0, mysql_core_1.json)('actions'), // ordered actions
    schedule: (0, mysql_core_1.json)('schedule'),
    requiresApproval: (0, mysql_core_1.boolean)('requiresApproval').default(true).notNull(),
    approvalType: (0, mysql_core_1.mysqlEnum)('approvalType', ['none', 'before_generation', 'before_publishing', 'both']).default('before_publishing'),
    isGlobal: (0, mysql_core_1.boolean)('isGlobal').default(false).notNull(),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    lastRunAt: (0, mysql_core_1.timestamp)('lastRunAt'),
    nextRunAt: (0, mysql_core_1.timestamp)('nextRunAt'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
// --- Tasks & Scheduling ---
exports.tasks = (0, mysql_core_1.mysqlTable)('tasks', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    prompt: (0, mysql_core_1.text)('prompt').notNull(),
    parsedAction: (0, mysql_core_1.json)('parsedAction'),
    status: (0, mysql_core_1.mysqlEnum)('status', ['pending', 'processing', 'completed', 'failed']).default('pending').notNull(),
    result: (0, mysql_core_1.text)('result'),
    error: (0, mysql_core_1.text)('error'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.taskSteps = (0, mysql_core_1.mysqlTable)('taskSteps', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    taskId: (0, mysql_core_1.int)('taskId').references(function () { return exports.tasks.id; }).notNull(),
    stepNumber: (0, mysql_core_1.int)('stepNumber').notNull(),
    action: (0, mysql_core_1.varchar)('action', { length: 128 }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }),
    status: (0, mysql_core_1.mysqlEnum)('status', ['pending', 'processing', 'completed', 'failed']).default('pending').notNull(),
    input: (0, mysql_core_1.json)('input'),
    output: (0, mysql_core_1.json)('output'),
    error: (0, mysql_core_1.text)('error'),
    startedAt: (0, mysql_core_1.timestamp)('startedAt'),
    completedAt: (0, mysql_core_1.timestamp)('completedAt'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.taskStepsRelations = (0, drizzle_orm_1.relations)(exports.taskSteps, function (_a) {
    var one = _a.one;
    return ({
        task: one(exports.tasks, {
            fields: [exports.taskSteps.taskId],
            references: [exports.tasks.id],
        }),
    });
});
exports.scheduledPosts = (0, mysql_core_1.mysqlTable)('scheduledPosts', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    contentId: (0, mysql_core_1.int)('contentId').references(function () { return exports.content.id; }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    scheduledAt: (0, mysql_core_1.timestamp)('scheduledAt').notNull(),
    status: (0, mysql_core_1.mysqlEnum)('status', ['pending', 'published', 'failed', 'cancelled']).default('pending').notNull(),
    publishedAt: (0, mysql_core_1.timestamp)('publishedAt'),
    error: (0, mysql_core_1.text)('error'),
    retryCount: (0, mysql_core_1.int)('retryCount').default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.scheduledPostsRelations = (0, drizzle_orm_1.relations)(exports.scheduledPosts, function (_a) {
    var one = _a.one;
    return ({
        content: one(exports.content, {
            fields: [exports.scheduledPosts.contentId],
            references: [exports.content.id],
        }),
        project: one(exports.projects, {
            fields: [exports.scheduledPosts.projectId],
            references: [exports.projects.id],
        }),
    });
});
// --- Campaigns ---
exports.batchPublishingCampaigns = (0, mysql_core_1.mysqlTable)('batchPublishingCampaigns', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    clientProfileId: (0, mysql_core_1.int)('clientProfileId').references(function () { return exports.clientProfiles.id; }).notNull(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    period: (0, mysql_core_1.mysqlEnum)('period', ['weekly', 'biweekly', 'monthly', 'quarterly']).default('monthly'),
    startDate: (0, mysql_core_1.timestamp)('startDate'),
    endDate: (0, mysql_core_1.timestamp)('endDate'),
    topic: (0, mysql_core_1.text)('topic'),
    contentBrief: (0, mysql_core_1.text)('contentBrief'),
    targetPlatforms: (0, mysql_core_1.json)('targetPlatforms'),
    contentPlan: (0, mysql_core_1.json)('contentPlan'),
    status: (0, mysql_core_1.mysqlEnum)('status', ['draft', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled']).default('draft').notNull(),
    approvedBy: (0, mysql_core_1.int)('approvedBy'), // references user, but we'll leave as int for now
    approvedAt: (0, mysql_core_1.timestamp)('approvedAt'),
    totalContent: (0, mysql_core_1.int)('totalContent').default(0),
    generatedContent: (0, mysql_core_1.int)('generatedContent').default(0),
    publishedContent: (0, mysql_core_1.int)('publishedContent').default(0),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.batchContentItems = (0, mysql_core_1.mysqlTable)('batchContentItems', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    campaignId: (0, mysql_core_1.int)('campaignId').references(function () { return exports.batchPublishingCampaigns.id; }).notNull(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    contentId: (0, mysql_core_1.int)('contentId').references(function () { return exports.content.id; }), // nullable if not yet generated
    contentType: (0, mysql_core_1.mysqlEnum)('contentType', ['long_form_article', 'social_post', 'newsletter', 'video_script', 'infographic', 'podcast_script', 'presentation']).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 512 }),
    body: (0, mysql_core_1.text)('body'),
    hashtags: (0, mysql_core_1.json)('hashtags'),
    mediaUrls: (0, mysql_core_1.json)('mediaUrls'),
    scheduledFor: (0, mysql_core_1.timestamp)('scheduledFor'),
    status: (0, mysql_core_1.mysqlEnum)('status', ['pending_generation', 'generated', 'pending_review', 'approved', 'scheduled', 'published', 'failed']).default('pending_generation').notNull(),
    reviewNotes: (0, mysql_core_1.text)('reviewNotes'),
    reviewedBy: (0, mysql_core_1.int)('reviewedBy'),
    reviewedAt: (0, mysql_core_1.timestamp)('reviewedAt'),
    publishedAt: (0, mysql_core_1.timestamp)('publishedAt'),
    publishedUrl: (0, mysql_core_1.varchar)('publishedUrl', { length: 512 }),
    postId: (0, mysql_core_1.varchar)('postId', { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.batchContentItemsRelations = (0, drizzle_orm_1.relations)(exports.batchContentItems, function (_a) {
    var one = _a.one;
    return ({
        campaign: one(exports.batchPublishingCampaigns, {
            fields: [exports.batchContentItems.campaignId],
            references: [exports.batchPublishingCampaigns.id],
        }),
        content: one(exports.content, {
            fields: [exports.batchContentItems.contentId],
            references: [exports.content.id],
        }),
    });
});
exports.engagementCampaigns = (0, mysql_core_1.mysqlTable)('engagementCampaigns', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    projectId: (0, mysql_core_1.int)('projectId').references(function () { return exports.projects.id; }).notNull(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    targetType: (0, mysql_core_1.mysqlEnum)('targetType', ['hashtag', 'user', 'keyword', 'competitor']).notNull(),
    targets: (0, mysql_core_1.json)('targets'),
    actions: (0, mysql_core_1.json)('actions'),
    dailyLimits: (0, mysql_core_1.json)('dailyLimits'),
    schedule: (0, mysql_core_1.json)('schedule'),
    brandVoice: (0, mysql_core_1.text)('brandVoice'),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.engagementActions = (0, mysql_core_1.mysqlTable)('engagementActions', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    campaignId: (0, mysql_core_1.int)('campaignId').references(function () { return exports.engagementCampaigns.id; }).notNull(),
    platform: (0, mysql_core_1.varchar)('platform', { length: 64 }).notNull(),
    actionType: (0, mysql_core_1.mysqlEnum)('actionType', ['like', 'comment', 'follow', 'share', 'reply']).notNull(),
    targetPostId: (0, mysql_core_1.varchar)('targetPostId', { length: 255 }),
    targetUserId: (0, mysql_core_1.varchar)('targetUserId', { length: 255 }),
    generatedContent: (0, mysql_core_1.text)('generatedContent'),
    status: (0, mysql_core_1.mysqlEnum)('status', ['pending', 'completed', 'failed']).default('pending').notNull(),
    error: (0, mysql_core_1.text)('error'),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
