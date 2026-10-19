# VA Portfolio

A prerendered Angular portfolio in an Nx workspace, managed with Bun. The first page is a responsive starter; personal details and real project content are intentionally left for customization.

## Stack

- Angular 22.2.3: standalone components, strict templates, zoneless change detection, lazy routing, and hydration.
- Nx 23.3.0 and Bun 1.4.3.
- Tailwind CSS 4.3.3 and Spartan UI 1.8.0. The copied button and utility sources live in `libs/ui`.
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
| `bun run build`        | Production build with prerendered HTML                         |
| `bun run preview`      | Build and serve the static production output                   |
| `bun run test`         | Vitest tests through Angular's native builder                  |
| `bun run test:watch`   | Unit tests in watch mode                                       |
| `bun run lint`         | ESLint checks for all projects                                 |
| `bun run format`       | Format source and configuration                                |
| `bun run format:check` | Check formatting                                               |
| `bun run check`        | Formatting, lint, unit tests, and production build             |
| `bun run e2e`          | Desktop and mobile Chromium tests against the production build |

Before the first browser test run:

```sh
bunx playwright install chromium
bun run e2e
```

On Linux CI, use `bunx playwright install --with-deps chromium`. The included GitHub Actions workflow installs the pinned toolchain and runs these checks. Set `BASE_URL` to run browser tests against an existing deployment instead of starting the local preview server.

## Project layout

```text
apps/
  portfolio/
    public/                     # Images, favicon, and future résumé
    src/app/
      content/portfolio.ts      # Profile, projects, and links
      pages/home/               # Homepage component, template, and styles
      app.routes.ts             # Small routing layer
  portfolio-e2e/                # Production browser checks
libs/ui/
  button/                       # Editable Spartan button
  utils/                        # Shared Spartan styling utilities
```

Edit `apps/portfolio/src/app/content/portfolio.ts` to add your name, introduction, projects, social links, and email. Contact links appear when an email is set. No form submission or backend is configured. Update the page title and social metadata in `apps/portfolio/src/index.html` when the final content is ready.

Global design tokens are in `apps/portfolio/src/styles.css`; page styles are beside the homepage. Add further Spartan primitives only as needed:

```sh
bunx nx generate @spartan-ng/cli:ui dialog
```

## Static deployment

`bun run build` produces `dist/apps/portfolio/browser`. Deploy that directory to a static host, including Cloudflare Workers Static Assets. The app uses Angular's `outputMode: static`; no running Node or Bun server is required in production. Server bootstrap files are used only during prerendering. The current single-page app sends unknown client-side routes back to `/`.

Hosting is not provisioned by this repository. Once a domain is chosen, add canonical and Open Graph URLs and configure the host's fallback behavior before publication.

## Adding AnalogJS later

Content and page components are kept independent of the routing and build setup. They can be reused when moving to AnalogJS. That migration still requires adding Analog's Nx integration, replacing the build and routing configuration, mapping pages to file-based routes, and validating prerendering and hydration again. Keep the existing Angular app working until the replacement passes the same checks.
