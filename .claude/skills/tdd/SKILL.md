---
name: tdd
description: Write code test-first in THIS repo — which test runner owns which project (Angular unit-test builder, the Node Vitest suite for the tRPC router, Playwright), the watch and single-spec commands, and the spec conventions. Use for any feature or bug fix in apps/portfolio, libs/api or apps/api. Takes precedence over generic TDD guidance on scope and commands.
---

# Test-driven development

**Relationship to `superpowers:test-driven-development`:** that skill owns the
discipline (red-green-refactor, honest tests). This one owns the scope and the
commands, and **wins on conflict**.

## Which surface tests what

| Change                                             | Spec                                                    | Runner                                                         |
| -------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| Component, route, service, DI token in `portfolio` | colocated `*.spec.ts` in `apps/portfolio/src`           | `@angular/build:unit-test` (Vitest + jsdom, `vi` globals)      |
| tRPC procedure in `libs/api/src/lib/router.ts`     | `libs/api/src/*.spec.ts`, over real HTTP                | plain Vitest, Node env, explicit `vitest` imports              |
| User-visible behavior of the built site            | `apps/portfolio-e2e/src/*.spec.ts`                      | Playwright against the prerendered preview (desktop + Pixel 7) |
| **Every bug fix**                                  | a failing spec at the lowest surface that reproduces it | —                                                              |

A new procedure is tested through `createApiServer()` and a typed tRPC client,
the way `libs/api/src/server.spec.ts` does, not by calling the router directly.
Test validation failures as HTTP errors too.

## The loop

```bash
bun run test:watch                                            # portfolio, watch mode
bunx nx test portfolio --include='**/<name>.spec.ts'          # one Angular spec
bunx vitest --config libs/api/vitest.config.ts                # API, watch mode
bunx nx test api-router -- server.spec                        # one API spec
bunx playwright test -c apps/portfolio-e2e/playwright.config.mts --project=chromium
```

1. **Red.** Write the spec and run it. It must fail **for the reason you
   expect**; a typo or a bad import isn't a red.
2. **Green.** The minimum code that passes.
3. **Refactor**, staying green. If it goes red, you changed behavior: revert
   and separate the refactor from the behavior change.

## Conventions

- `it`, never `test`; no "should". Name the behavior: `it('returns unknown
URLs to the single-page portfolio')`.
- Angular specs: drive routes with `RouterTestingHarness` and query the
  rendered DOM; inject tokens through `TestBed`. Stub `fetch` with
  `vi.stubGlobal` and undo it in `afterEach`.
- Content-driven assertions read from `content/portfolio.ts` copy; if the
  copy changes, update the spec in the same change.
- Zoneless: no `fakeAsync`/`tick`. `await` the harness or `fixture.whenStable()`.

## Verify

```bash
bun run test && bun run lint && bun run typecheck
```

For anything that touches rendering, routing or prerender, also run `bun run e2e`.
