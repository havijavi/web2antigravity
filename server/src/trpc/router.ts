import { router } from './trpc';
import { authRouter } from './routers/auth';
import { projectsRouter } from './routers/projects';
import { contentRouter } from './routers/content';
import { clientProfilesRouter } from './routers/clientProfiles';
import { campaignsRouter } from './routers/campaigns';
import { automationRouter } from './routers/automation';
import { analyticsRouter } from './routers/analytics';
import { usersRouter } from './routers/users';

export const appRouter = router({
    auth: authRouter,
    projects: projectsRouter,
    content: contentRouter,
    clientProfiles: clientProfilesRouter,
    campaigns: campaignsRouter,
    automation: automationRouter,
    analytics: analyticsRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;
