import { inject, InjectionToken } from '@angular/core';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TRPCClient } from '@trpc/client';
import type { AppRouter } from '@portfolio/api';

// Override in app.config.ts for a separately hosted API. Server-side queries
// need an absolute URL; the default is for same-origin browser requests.
export const TRPC_API_URL = new InjectionToken<string>('TRPC_API_URL', {
  providedIn: 'root',
  factory: () => '/api/trpc',
});

export const TRPC_CLIENT = new InjectionToken<TRPCClient<AppRouter>>(
  'TRPC_CLIENT',
  {
    providedIn: 'root',
    factory: () =>
      createTRPCClient<AppRouter>({
        links: [httpBatchLink({ url: inject(TRPC_API_URL) })],
      }),
  },
);
