# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Coffeediary is a personal Angular 20 web app for logging espresso recipes and extractions ("pulls"). Data is persisted in Cloudflare D1 behind a Cloudflare Worker (`worker/`), which also serves the built Angular app (migration from Supabase/GitHub Pages in progress, see `docs/MIGRATION_CLOUDFLARE.md`).
The App is primarily designed for use via Smartphones, therefore responseable design is mandatory.

## Commands

- `npm start` — run dev server (`ng serve`)
- `npm run build` — production build (output in `dist/coffeediary`)
- `npm run watch` — development build in watch mode
- `npm test` — run Karma/Jasmine tests
- `npm test -- --include='**/foo.spec.ts'` — run a single spec file
- `npm run dev:api` — run the Worker locally (`wrangler dev`, port 8787, local D1); `npm start` proxies `/api` to it via `proxy.conf.json`. Needs `.dev.vars` with `SESSION_SECRET` (optional `DEV_USER_EMAIL` to skip login)
- `npm run deploy` — build Angular and `wrangler deploy`
- `npm run db:migrate` — apply `migrations/*.sql` to the remote D1 database
- `npm run typecheck:worker` — typecheck the Worker

## Architecture

Standalone-component Angular app (no NgModules) using **zoneless change detection** (`provideZonelessChangeDetection` in `src/app/app.config.ts`). When writing components, prefer signals and `ChangeDetectionStrategy.OnPush`-friendly patterns; do not rely on Zone.js auto-detection.

Routing is in `src/app/app.routes.ts` and uses lazy `loadComponent` for feature routes. Default route redirects to `/espressos`.

### Layers

- `worker/` — Cloudflare Worker: `/api/*` REST API over D1 (`resources.ts`), Google login + sessions (`auth.ts`), everything else is served from `dist/coffeediary/browser` (SPA fallback). Config in `wrangler.jsonc`, schema in `migrations/`.
- `src/app/backend/` — the only data-access layer in the app: `EspressosApi` / `HandbrewsApi` (HttpClient → `/api`, Promise-based), base URL via the `API_BASE_URL` token in `api.config.ts`. Responses keep the nested shape (`espresso_pulls`, `handbrew_pulls`).
- `src/app/services/` — cross-cutting Angular services (`snack-bar.service.ts`, `auth.service.ts` – Google Identity Services login against the Worker, `auth.interceptor.ts`).
- `src/app/espressos/` — feature components (`espressos.component`, `extraction-overview.component`, `new-espresso-dialog.component`, `new-extraction-dialog.component`). Dialogs are Angular Material `MatDialog`-based and pass an `espressoId` for extraction creation.
- `src/app/ui/` — shared shell components (`app-toolbar`, `app-footer`).

### UI

Angular Material (`@angular/material` + `@angular/cdk`) is the component library. Styles use SCSS (`inlineStyleLanguage: scss` in `angular.json`).

## Code style

- Prettier config lives in `package.json`: `printWidth: 100`, `singleQuote: true`, Angular HTML parser for templates.
- Some existing comments/strings are in German — match the surrounding language when editing nearby code.
