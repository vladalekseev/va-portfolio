import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './lib/router';

export { appRouter } from './lib/router';

export function createApiServer() {
  return createHTTPServer({
    router: appRouter,
    basePath: '/api/trpc/',
  });
}
