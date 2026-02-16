
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { projects } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const projectsRouter = router({
    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.select().from(projects);
        // In real app filter by ctx.user.id
    }),

    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            clientName: z.string().optional(),
            industry: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.insert(projects).values({
                ...input,
                userId: 1, // Mock user ID for now
            });
            return { success: true };
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            const project = await ctx.db.query.projects.findFirst({
                where: eq(projects.id, input.id),
            });
            return project;
        }),
});
