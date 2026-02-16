
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { content } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { AIService } from '../../services/aiService';

export const contentRouter = router({
    list: protectedProcedure
        .input(z.object({ projectId: z.number() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.select().from(content).where(eq(content.projectId, input.projectId));
        }),

    generate: protectedProcedure
        .input(z.object({
            projectId: z.number(),
            prompt: z.string(),
            platform: z.string(),
            provider: z.string().optional(),
            model: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const aiService = AIService.getInstance();
            const generatedText = await aiService.generateContent(input.prompt, {}, {
                provider: input.provider,
                model: input.model
            });

            // Save draft
            // @ts-ignore
            await ctx.db.insert(content).values({
                projectId: input.projectId,
                body: generatedText,
                platform: input.platform,
                status: 'draft',
                title: 'AI Generated Draft',
                contentType: 'social_post', // Default for now
            });

            return { success: true, content: generatedText };
        }),
});
