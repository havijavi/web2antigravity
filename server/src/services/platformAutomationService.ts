
import { db } from '../db';
import { platformCredentials, tasks, taskSteps } from '../db/schema';
import { eq, and } from 'drizzle-orm';

interface PlatformRateLimit {
    requests: number;
    windowMs: number;
    minDelayMs: number;
}

const PLATFORM_RATE_LIMITS: Record<string, PlatformRateLimit> = {
    twitter: { requests: 50, windowMs: 15 * 60 * 1000, minDelayMs: 2000 },
    linkedin: { requests: 100, windowMs: 24 * 60 * 60 * 1000, minDelayMs: 5000 },
    facebook: { requests: 200, windowMs: 60 * 60 * 1000, minDelayMs: 3000 },
    medium: { requests: 10, windowMs: 60 * 60 * 1000, minDelayMs: 10000 },
    instagram: { requests: 25, windowMs: 60 * 60 * 1000, minDelayMs: 5000 },
    pinterest: { requests: 50, windowMs: 60 * 60 * 1000, minDelayMs: 3000 },
    youtube: { requests: 10, windowMs: 24 * 60 * 60 * 1000, minDelayMs: 30000 },
    tiktok: { requests: 20, windowMs: 60 * 60 * 1000, minDelayMs: 5000 },
};

const HUMAN_DELAY_RANGES = {
    typing: { min: 50, max: 150 },
    reading: { min: 2000, max: 5000 },
    thinking: { min: 1000, max: 3000 },
    scrolling: { min: 500, max: 2000 },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomDelay = (range: { min: number, max: number }) => {
    return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
};

import { PlatformHandler } from './platforms/types';
import { LinkedInHandler } from './platforms/linkedin';
import { TwitterHandler } from './platforms/twitter';

export class PlatformAutomationService {
    private static instance: PlatformAutomationService;
    private queue: any[] = []; // In-memory queue (replace with BullMQ later)
    private processing: boolean = false;
    private lastRequestTime: Record<string, number> = {};
    private handlers: Record<string, PlatformHandler> = {};

    private constructor() {
        this.registerHandler(new LinkedInHandler());
        this.registerHandler(new TwitterHandler());
    }

    public static getInstance(): PlatformAutomationService {
        if (!PlatformAutomationService.instance) {
            PlatformAutomationService.instance = new PlatformAutomationService();
        }
        return PlatformAutomationService.instance;
    }

    public registerHandler(handler: PlatformHandler) {
        this.handlers[handler.name] = handler;
    }

    public async scheduleTask(taskId: number, action: string, platform: string, payload: any) {
        this.queue.push({ taskId, action, platform, payload });
        this.processQueue();
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const job = this.queue.shift();
            if (!job) break;

            try {
                await this.executeJob(job);
            } catch (error) {
                console.error(`Error processing job for task ${job.taskId}:`, error);
                // Update task status to failed in DB
            }
        }

        this.processing = false;
    }

    private async executeJob(job: any) {
        const { platform, action, payload } = job;
        const rateLimit = PLATFORM_RATE_LIMITS[platform] || { minDelayMs: 1000, requests: 10, windowMs: 60000 };

        // Rate Limiting Check
        const lastRequest = this.lastRequestTime[platform] || 0;
        const now = Date.now();
        const timeSinceLast = now - lastRequest;

        if (timeSinceLast < rateLimit.minDelayMs) {
            await delay(rateLimit.minDelayMs - timeSinceLast);
        }

        // Human Delay Simulation
        await delay(getRandomDelay(HUMAN_DELAY_RANGES.thinking));

        console.log(`Executing ${action} on ${platform} for task ${job.taskId}`);

        const handler = this.handlers[platform];
        if (!handler) {
            console.warn(`No handler found for platform: ${platform}`);
            return;
        }

        let result;
        try {
            switch (action) {
                case 'publish':
                    result = await handler.publishContent(payload);
                    break;
                case 'comment':
                    result = await handler.postComment(payload.postId, payload.comment);
                    break;
                case 'like':
                    result = await handler.likePost(payload.postId);
                    break;
                default:
                    console.warn(`Unknown action: ${action}`);
            }

            console.log(`Job result for ${job.taskId}:`, result);
        } catch (e) {
            console.error(`Handler error:`, e);
        }

        this.lastRequestTime[platform] = Date.now();

        // Update DB
        // await db.update(taskSteps).set({ status: 'completed', completedAt: new Date() }).where(eq(taskSteps.id, job.stepId));
    }
}
