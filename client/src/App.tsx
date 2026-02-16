
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './lib/trpc';
import { Toaster } from 'sonner';
import { Route, Switch } from 'wouter';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContentPage } from './pages/ContentPage';
import { ClientsPage } from './pages/ClientsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { AutomationPage } from './pages/AutomationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:5001/trpc',
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/content" component={ContentPage} />
          <Route path="/clients" component={ClientsPage} />
          <Route path="/campaigns" component={CampaignsPage} />
          <Route path="/automation" component={AutomationPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/settings" component={SettingsPage} />
          {/* Add more routes here */}
          <Route>404: No such page!</Route>
        </Switch>
        <Toaster theme="dark" position="bottom-right" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
