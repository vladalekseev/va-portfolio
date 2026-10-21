import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { describe, expect, it } from 'vitest';
import type { AppRouter } from './index';
import { handleApiRequest } from './server';

const url = 'https://portfolio.example.test/api/trpc';

describe('tRPC Fetch API handler', () => {
  it('serves typed queries and batches through the Fetch adapter', async () => {
    const client = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
          fetch: (input, init) => handleApiRequest(new Request(input, init)),
        }),
      ],
    });

    await expect(
      Promise.all([client.health.query(), client.health.query()]),
    ).resolves.toEqual([{ status: 'ok' }, { status: 'ok' }]);
  });

  it('returns a tRPC not-found error for an unknown procedure', async () => {
    const response = await handleApiRequest(new Request(`${url}/missing`));
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      error: { data: { code: 'NOT_FOUND', path: 'missing' } },
    });
  });

  it('rejects mutations against a read-only query', async () => {
    const response = await handleApiRequest(
      new Request(`${url}/health`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }),
    );
    expect(response.status).toBe(405);
  });
});
