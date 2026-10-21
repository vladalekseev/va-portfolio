# VA Portfolio

A prerendered Angular portfolio in an Nx workspace, managed with Bun. The first page is a responsive starter; personal details and real project content are intentionally left for customization.

## Stack

- Angular 22.2.3: standalone components, strict templates, zoneless change detection, lazy routing, and hydration.
- Nx 23.3.0 and Bun 1.4.3.
- Angular Material 22.2.3 with a custom Material 3 theme.
- tRPC 11.19.0 with a typed Angular client and an optional local API.
- Native Angular Vitest integration, Playwright, Angular ESLint, and Prettier.

Exact dependency versions are in `package.json` and `bun.lock`. Node 24.21.0 and Bun 1.4.3 are pinned in `mise.toml`; `.nvmrc` is also provided for nvm users. Bun manages packages and scripts while Angular/Nx tooling can use Node.

## Run locally

Install the pinned tools with `mise install` if you use mise, or install Node and Bun independently, then:

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:4200`.

| Command                | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `bun run dev`          | Development server with live updates                           |
| `bun run dev:api`      | Local tRPC API on port 3000                                    |
| `bun run dev:full`     | Angular and tRPC development servers together                  |
| `bun run build`        | Production build with prerendered HTML                         |
| `bun run preview`      | Build and serve the static production output                   |
| `bun run test`         | Angular unit tests and tRPC HTTP integration tests             |
| `bun run test:watch`   | Unit tests in watch mode                                       |
| `bun run lint`         | ESLint checks for all projects                                 |
| `bun run typecheck`    | Type-check the API host, router, and API tests                 |
| `bun run format`       | Format source and configuration                                |
| `bun run format:check` | Check formatting                                               |
| `bun run check`        | Formatting, lint, API types, tests, and production build       |
| `bun run e2e`          | Desktop and mobile Chromium tests against the production build |

Before the first browser test run:

```sh
bunx playwright install chromium
bun run e2e
```

On Linux CI, use `bunx playwright install --with-deps chromium`. The included GitHub Actions workflow installs the pinned toolchain and runs these checks. Set `BASE_URL` to run browser tests against an existing deployment instead of starting the local preview server.

`bun install` sets up Husky: pre-commit checks formatting and runs lint and type checks for affected projects, and commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).

Agent workflow and hook setup are documented in [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md). Hooks require Bash and `jq`, plus Python 3.9+ for the Codex patch adapter. Run `python3 .claude/hooks/test_secret_file_guard.py` after changing the credential-path guard.

## Project layout

```text
apps/
  api/                          # Optional local tRPC HTTP server
  portfolio/
    public/                     # Images, favicon, and future résumé
    src/app/
      content/portfolio.ts      # Profile, projects, and links
      data-access/trpc.ts        # Injectable typed tRPC client and endpoint
      pages/home/               # Homepage component, template, and styles
      app.routes.ts             # Small routing layer
  portfolio-e2e/                # Production browser checks
libs/api/
  src/index.ts                  # Type-only API contract for browser consumers
  src/lib/router.ts             # tRPC procedures
  src/server.ts                 # Server-only HTTP adapter
```

Edit `apps/portfolio/src/app/content/portfolio.ts` to add your name, introduction, projects, social links, and email. Contact links appear when an email is set. The homepage still uses local content; the optional API currently exposes only a health query. Update the page title and social metadata in `apps/portfolio/src/index.html` when the final content is ready.

The [Material theme](https://material.angular.dev/guide/theming) is in `apps/portfolio/src/styles.scss`; page styles are beside the homepage. Import Material components directly from their package entry points as needed. Use Material's Sass theme and component override APIs to customize them.

## Future data fetching with tRPC

Run both development servers with:

```sh
bun run dev:full
```

Angular proxies `/api/trpc/**` to `http://127.0.0.1:3000`, so browser requests stay on the same origin. `bun run dev` alone remains sufficient for working on the static homepage. The API host accepts `HOST` and `PORT`; update `apps/portfolio/proxy.conf.json` if you change its port.

Inject the [vanilla tRPC client](https://trpc.io/docs/client/vanilla/setup) into a component or service:

```ts
import { inject, Injectable } from '@angular/core';
import { TRPC_CLIENT } from './trpc'; // Adjust to the data-access file location.

@Injectable({ providedIn: 'root' })
export class ApiStatus {
  private readonly api = inject(TRPC_CLIENT);

  check() {
    return this.api.health.query(); // Promise<{ status: 'ok' }>
  }
}
```

Add future data queries in `libs/api/src/lib/router.ts`; the client infers their inputs and results from `AppRouter`. Add runtime input validation when introducing procedures that accept input. Import only types from `@portfolio/api` in browser code; `@portfolio/api/server` is reserved for the API host. No requests are made just by injecting the client, and no API is needed during the current build or prerender.

The client defaults to `/api/trpc`. Override `TRPC_API_URL` in `app.config.ts` for a separately hosted API, and configure that server's CORS policy if it is on another origin. Future server-side queries need an absolute API URL and an API reachable during rendering; Angular's HTTP transfer cache does not automatically cache the tRPC client's fetch requests.

## Static deployment

`bun run build` produces `dist/apps/portfolio/browser`. Deploy that directory to a static host, including Cloudflare Workers Static Assets. The app uses Angular's `outputMode: static`; no running Node or Bun server is required in production. Server bootstrap files are used only during prerendering. The current single-page app sends unknown client-side routes back to `/`.

Hosting is not provisioned by this repository. Once a domain is chosen, add canonical and Open Graph URLs and configure the host's fallback behavior before publication.

Static hosting does not run the tRPC API, and the development proxy is not included in production output. Before enabling live queries, deploy the API separately and route `/api/trpc/*` to it, or configure an absolute API URL. The shared router can be hosted with another [tRPC adapter](https://trpc.io/docs/server/adapters), including a Fetch adapter for an edge runtime.

## Adding AnalogJS later

Content and page components are kept independent of the routing and build setup. They can be reused when moving to AnalogJS. That migration still requires adding Analog's Nx integration, replacing the build and routing configuration, mapping pages to file-based routes, and validating prerendering and hydration again. Keep the existing Angular app working until the replacement passes the same checks.
