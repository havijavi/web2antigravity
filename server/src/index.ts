
import express from 'express';
import cors from 'cors';
import { db } from './db';
import { ScheduledPublishingService } from './services/scheduledPublishingService';

import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/trpc';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

app.get('/', (req, res) => {
    res.send('ORM Automation Platform API');
});

app.get('/health', async (req, res) => {
    try {
        // Basic DB check
        // @ts-ignore
        await db.execute(sql`SELECT 1`);
        res.json({ status: 'ok', db: 'connected' });
    } catch (e) {
        res.json({ status: 'ok', db: 'disconnected', error: String(e) });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

    // Start Services
    ScheduledPublishingService.getInstance().startScheduler();
});
