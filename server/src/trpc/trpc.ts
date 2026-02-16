
import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { db } from '../db';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
    const token = req.headers.authorization?.split(' ')[1];
    // Basic context, will add user auth later
    return {
        req,
        res,
        db,
        token,
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.token) {
        throw new Error('UNAUTHORIZED');
    }
    // Verify token logic here
    return next({
        ctx: {
            // user: verifiedUser
        },
    });
});
