
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { engagementCampaigns, engagementActions } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const automationRouter = router({
    listCampaigns: protectedProcedure
        .input(z.object({ projectId: z.number() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.select().from(engagementCampaigns)
                .where(eq(engagementCampaigns.projectId, input.projectId))
                .orderBy(desc(engagementCampaigns.createdAt));
        }),

    createCampaign: protectedProcedure
        .input(z.object({
            projectId: z.number(),
            name: z.string(),
            platform: z.string(),
            targetType: z.enum(['hashtag', 'user', 'keyword', 'competitor']),
            targets: z.array(z.string()),
            actions: z.array(z.string()), // e.g., ['like', 'comment']
        }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.insert(engagementCampaigns).values({
                projectId: input.projectId,
                name: input.name,
                platform: input.platform,
                targetType: input.targetType,
                targets: input.targets,
                actions: input.actions,
                status: 'active',
            });
            return { success: true };
        }),

    toggleCampaign: protectedProcedure
        .input(z.object({ id: z.number(), isActive: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.update(engagementCampaigns)
                .set({ isActive: input.isActive })
                .where(eq(engagementCampaigns.id, input.id));
            return { success: true };
        }),
});
