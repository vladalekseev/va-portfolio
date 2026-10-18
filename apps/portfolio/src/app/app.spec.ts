import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appRoutes } from './app.routes';

describe('Portfolio routing', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [provideRouter(appRoutes)] }),
  );

  it('loads the portfolio page through the lazy route', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(
      harness.routeNativeElement?.querySelector('main h1')?.textContent,
    ).toContain('A place for what’s next.');
  });

  it('returns unknown URLs to the single-page portfolio', async () => {
    const harness = await RouterTestingHarness.create('/unknown-page');
    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.querySelector('#work')).not.toBeNull();
  });
});
