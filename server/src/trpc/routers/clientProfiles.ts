
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { clientProfiles } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const clientProfilesRouter = router({
    list: protectedProcedure
        .input(z.object({ projectId: z.number() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.select().from(clientProfiles).where(eq(clientProfiles.projectId, input.projectId));
        }),

    create: protectedProcedure
        .input(z.object({
            projectId: z.number(),
            name: z.string(),
            email: z.string().email().optional(),
            industry: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.insert(clientProfiles).values(input);
            return { success: true };
        }),
});
