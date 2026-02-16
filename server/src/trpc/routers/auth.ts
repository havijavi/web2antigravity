
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authRouter = router({
    register: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(8),
            name: z.string().min(2),
        }))
        .mutation(async ({ input, ctx }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            try {
                await ctx.db.insert(users).values({
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                    role: 'user',
                });
                return { success: true };
            } catch (e) {
                throw new Error('User already exists');
            }
        }),

    login: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.email, input.email),
            });

            if (!user || !await bcrypt.compare(input.password, user.password)) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '7d' }
            );

            return { token, user: { id: user.id, name: user.name, email: user.email } };
        }),

    me: protectedProcedure
        .query(async ({ ctx }) => {
            // return ctx.user;
            return { id: 1, name: 'Test User' }; // Mock for now until context auth is fully wired
        }),
});
