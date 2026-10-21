import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './lib/router';

export { appRouter } from './lib/router';

const apiBasePath = '/api/trpc';

export function createApiServer() {
  return createHTTPServer({
    router: appRouter,
    basePath: `${apiBasePath}/`,
  });
}

// Web-standard entry for serverless hosts such as Vercel Functions.
export function handleApiRequest(request: Request) {
  return fetchRequestHandler({
    endpoint: apiBasePath,
    req: request,
    router: appRouter,
  });
}
