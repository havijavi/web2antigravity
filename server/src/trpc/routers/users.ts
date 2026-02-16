
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { users } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
// @ts-ignore
import bcrypt from 'bcryptjs';

export const usersRouter = router({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                isActive: users.isActive,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt,
            }).from(users).orderBy(desc(users.createdAt));
        }),

    create: protectedProcedure
        .input(z.object({
            name: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(6),
            role: z.enum(['admin', 'user']),
        }))
        .mutation(async ({ input, ctx }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // @ts-ignore
            await ctx.db.insert(users).values({
                name: input.name,
                email: input.email,
                password: hashedPassword,
                role: input.role,
                isActive: true,
            });
            return { success: true };
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            email: z.string().email().optional(),
            role: z.enum(['admin', 'user']).optional(),
            password: z.string().min(6).optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const updates: any = {
                ...(input.name && { name: input.name }),
                ...(input.email && { email: input.email }),
                ...(input.role && { role: input.role }),
            };

            if (input.password) {
                updates.password = await bcrypt.hash(input.password, 10);
            }

            // @ts-ignore
            await ctx.db.update(users)
                .set(updates)
                .where(eq(users.id, input.id));
            return { success: true };
        }),

    toggleStatus: protectedProcedure
        .input(z.object({ id: z.number(), isActive: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
            // @ts-ignore
            await ctx.db.update(users)
                .set({ isActive: input.isActive })
                .where(eq(users.id, input.id));
            return { success: true };
        }),
});
