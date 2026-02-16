
import { db } from '../db';
import { scheduledPosts, content } from '../db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { PlatformAutomationService } from './platformAutomationService';

export class ScheduledPublishingService {
    private static instance: ScheduledPublishingService;
    private automationService: PlatformAutomationService;
    private checkInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.automationService = PlatformAutomationService.getInstance();
    }

    public static getInstance(): ScheduledPublishingService {
        if (!ScheduledPublishingService.instance) {
            ScheduledPublishingService.instance = new ScheduledPublishingService();
        }
        return ScheduledPublishingService.instance;
    }

    public startScheduler(intervalMs: number = 60000) {
        if (this.checkInterval) clearInterval(this.checkInterval);
        this.checkInterval = setInterval(() => this.checkScheduledPosts(), intervalMs);
        console.log('Scheduler started.');
    }

    public stopScheduler() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private async checkScheduledPosts() {
        const now = new Date();

        // Find due pending posts
        const postsToPublish = await db.query.scheduledPosts.findMany({
            where: (posts, { eq, and, lte }) => and(
                eq(posts.status, 'pending'),
                lte(posts.scheduledAt, now)
            ),
            with: {
                content: true,
            }
        });

        for (const post of postsToPublish) {
            console.log(`Publishing post ${post.id} to ${post.platform}`);

            // Update status to prevent double processing
            // Note: 'processing' status not in enum, skipping for now to avoid schema change
            // Ideal fix: Add 'processing' to enum or use a lock table

            try {
                // Schedule the actual publishing task
                await this.automationService.scheduleTask(0, 'publish', post.platform, {
                    contentId: post.contentId,
                    body: post.content.body,
                    mediaUrls: post.content.mediaUrls,
                });

                // Update to published
                await db.update(scheduledPosts)
                    .set({ status: 'published', publishedAt: new Date() })
                    .where(eq(scheduledPosts.id, post.id));

            } catch (error) {
                console.error(`Failed to publish post ${post.id}:`, error);
                await db.update(scheduledPosts)
                    .set({ status: 'failed', error: String(error) })
                    .where(eq(scheduledPosts.id, post.id));
            }
        }
    }
}
