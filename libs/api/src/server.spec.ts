import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AppRouter } from './index';
import { createApiServer } from './server';

describe('tRPC HTTP API', () => {
  const server = createApiServer();
  let url: string;

  beforeAll(async () => {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const { port } = server.address() as AddressInfo;
    url = `http://127.0.0.1:${port}/api/trpc`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  });

  it('serves typed queries and batches through the HTTP adapter', async () => {
    const client = createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url })],
    });

    await expect(
      Promise.all([client.health.query(), client.health.query()]),
    ).resolves.toEqual([{ status: 'ok' }, { status: 'ok' }]);
  });

  it('returns a tRPC not-found error for an unknown procedure', async () => {
    const response = await fetch(`${url}/missing`);
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      error: { data: { code: 'NOT_FOUND', path: 'missing' } },
    });
  });

  it('rejects mutations against a read-only query', async () => {
    const response = await fetch(`${url}/health`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    expect(response.status).toBe(405);
  });
});
