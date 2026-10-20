import { TestBed } from '@angular/core/testing';
import { TRPC_API_URL, TRPC_CLIENT } from './trpc';

describe('Angular tRPC client', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not fetch when the client is injected', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    TestBed.inject(TRPC_CLIENT);

    expect(TestBed.inject(TRPC_API_URL)).toBe('/api/trpc');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('uses the configured endpoint and decodes a typed query result', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TRPC_API_URL,
          useValue: 'https://api.example.test/api/trpc',
        },
      ],
    });
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ result: { data: { status: 'ok' } } }]), {
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchSpy);

    await expect(TestBed.inject(TRPC_CLIENT).health.query()).resolves.toEqual({
      status: 'ok',
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.example.test/api/trpc/health?batch=1',
      ),
      expect.any(Object),
    );
  });
});
