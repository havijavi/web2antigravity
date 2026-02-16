
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { batchPublishingCampaigns, clientProfiles } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const campaignsRouter = router({
    list: protectedProcedure
        .input(z.object({ projectId: z.number() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.query.batchPublishingCampaigns.findMany({
                where: eq(batchPublishingCampaigns.projectId, input.projectId),
                orderBy: [desc(batchPublishingCampaigns.createdAt)],
                with: {
                    // @ts-ignore
                    clientProfile: true
                }
            });
        }),

    create: protectedProcedure
        .input(z.object({
            projectId: z.number(),
            clientProfileId: z.number(),
            name: z.string(),
            description: z.string().optional(),
            period: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
            startDate: z.string().transform(str => new Date(str)),
            endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
            topic: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.insert(batchPublishingCampaigns).values({
                projectId: input.projectId,
                clientProfileId: input.clientProfileId,
                name: input.name,
                description: input.description,
                period: input.period,
                startDate: input.startDate,
                endDate: input.endDate,
                topic: input.topic,
                status: 'draft',
            });
            return { success: true };
        }),

    get: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.query.batchPublishingCampaigns.findFirst({
                where: eq(batchPublishingCampaigns.id, input.id),
                with: {
                    // @ts-ignore
                    clientProfile: true
                }
            });
        }),
});
