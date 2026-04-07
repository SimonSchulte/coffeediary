# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Coffeediary is a personal Angular 20 web app for logging espresso recipes and extractions ("pulls"). Data is persisted in Supabase. The app is deployed to GitHub Pages via `angular-cli-ghpages`.
The App is primarily designed for use via Smartphones, therefore responseable design is mandatory.

## Commands

- `npm start` — run dev server (`ng serve`)
- `npm run build` — production build (output in `dist/coffeediary`)
- `npm run watch` — development build in watch mode
- `npm test` — run Karma/Jasmine tests
- `npm test -- --include='**/foo.spec.ts'` — run a single spec file
- `ng deploy` — deploy to GitHub Pages (uses `angular-cli-ghpages`)

## Architecture

Standalone-component Angular app (no NgModules) using **zoneless change detection** (`provideZonelessChangeDetection` in `src/app/app.config.ts`). When writing components, prefer signals and `ChangeDetectionStrategy.OnPush`-friendly patterns; do not rely on Zone.js auto-detection.

Routing is in `src/app/app.routes.ts` and uses lazy `loadComponent` for feature routes. Default route redirects to `/espressos`.

### Layers

- `src/app/backend/supabase.espressos.service.ts` — the only data-access layer. Wraps `@supabase/supabase-js` and exposes async CRUD over two tables: `espressos` (with a default recipe: `gramms`, `ratio`, `grinder_setting`, `runtime`) and `espresso_pulls` (individual extractions joined to an espresso via `espresso_id`). `getAll()` returns espressos with their nested `espresso_pulls`. The Supabase URL and anon key are currently **hard-coded** in this file — when touching it, keep that in mind rather than assuming env-based config.
- `src/app/services/` — cross-cutting Angular services (`snack-bar.service.ts`, `supabase-auth.service.ts`).
- `src/app/espressos/` — feature components (`espressos.component`, `extraction-overview.component`, `new-espresso-dialog.component`, `new-extraction-dialog.component`). Dialogs are Angular Material `MatDialog`-based and pass an `espressoId` for extraction creation.
- `src/app/ui/` — shared shell components (`app-toolbar`, `app-footer`).

### UI

Angular Material (`@angular/material` + `@angular/cdk`) is the component library. Styles use SCSS (`inlineStyleLanguage: scss` in `angular.json`).

## Code style

- Prettier config lives in `package.json`: `printWidth: 100`, `singleQuote: true`, Angular HTML parser for templates.
- Some existing comments/strings are in German — match the surrounding language when editing nearby code.
