# Migrationsplan: Coffeediary → Cloudflare

Ziel: Coffeediary vollständig auf den eigenen Cloudflare-Account umziehen und **Supabase** (Datenbank + Auth)
sowie **GitHub Pages** (Hosting) ablösen.

## 1. Ausgangslage (Ist-Zustand)

| Bereich         | Heute                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| Hosting         | GitHub Pages via `angular-cli-ghpages` (`ng deploy`), Base-Path `/coffeediary/`         |
| Datenbank       | Supabase Postgres, Tabellen `espressos`, `espresso_pulls`, `handbrews`, `handbrew_pulls` |
| Datenzugriff    | direkt aus dem Browser per `@supabase/supabase-js` (anon key, Schutz nur über RLS)       |
| Auth            | Supabase Auth mit Google OAuth (`supabase-auth.service.ts`)                              |
| Konfiguration   | URL + anon key **hart codiert** in 3 Dateien                                            |

Betroffene Dateien:

- `src/app/backend/supabase.espressos.service.ts`
- `src/app/backend/supabase.handbrews.service.ts`
- `src/app/services/supabase-auth.service.ts` (genutzt von `app.ts` und `ui/app-toolbar.component.ts`)
- `src/index.html` (lädt `accounts.google.com/gsi/client`, wird nicht verwendet)
- `angular.json` (`deploy`-Target), `package.json` (`angular-cli-ghpages`, `@supabase/supabase-js`)
- `.mcp.json` (Supabase-MCP)

Cloudflare-Account: bereits vorhanden (Workers `stationwizard`, `hiorg-oidc-bridge`, mehrere D1-Datenbanken).
Für Coffeediary existieren noch keine Ressourcen.

## 2. Zielarchitektur

```
Smartphone-Browser
   │  https://coffeediary.<domain>   (oder coffeediary.<account>.workers.dev)
   ▼
Cloudflare Access  ── Google-Login, Allow-List per E-Mail
   ▼
Worker "coffeediary"
   ├─ /api/*  → REST-API (TypeScript, prüft Access-JWT) ──► D1 "coffeediary"
   └─ alles andere → Static Assets (Angular-Build, SPA-Fallback auf index.html)
```

| Baustein   | Cloudflare-Produkt                                   | Ersetzt                    |
| ---------- | ---------------------------------------------------- | -------------------------- |
| Hosting    | **Workers Static Assets** (SPA-Modus)                | GitHub Pages               |
| API        | **Worker** (`/api/*`, gleiche Origin → kein CORS)    | supabase-js / PostgREST    |
| Datenbank  | **D1** (SQLite)                                      | Supabase Postgres          |
| Auth       | **Cloudflare Access** (Zero Trust, Google als IdP)   | Supabase Auth              |
| CI/CD      | **Workers Builds** (Git-Integration) o. GitHub Action | `ng deploy` / gh-pages     |
| Backups    | D1 Time Travel + optionaler Export                   | Supabase Backups           |

### Warum diese Entscheidungen

- **Workers statt Pages**: Cloudflare führt Pages in Workers zusammen; ein einziger Worker liefert Frontend
  *und* API aus, eine Deployment-Einheit, keine CORS-Konfiguration.
- **D1**: Datenmodell ist klein und relational (2 × Kopf/Positionen), passt 1:1 auf SQLite. Free Tier reicht
  bei Weitem. Hyperdrive + externes Postgres wäre nur nötig, wenn man Postgres behalten möchte.
- **Cloudflare Access statt eigener Auth**: Die App ist persönlich, Nutzer werden laut README manuell
  freigeschaltet („shoot me an email“). Genau das ist eine Access-Allow-List. Free bis 50 Nutzer, Google-Login,
  kein eigener OAuth-Code, kein Token-Handling im Angular-Code. Der Worker verifiziert nur das
  `Cf-Access-Jwt-Assertion`-Header-JWT.
  *Alternative*: eigener Google-OIDC-Flow im Worker (Muster wie `hiorg-oidc-bridge`) – mehr Code, nur sinnvoll,
  falls später Self-Signup gewünscht ist.

## 3. Offene Punkte vor dem Start

1. **Schema in Supabase verifizieren** (Spaltentypen, Defaults, `ON DELETE`-Verhalten, evtl. vorhandene
   `user_id`-Spalten und RLS-Policies). Die Supabase-MCP-Verbindung war bei der Planerstellung nicht
   erreichbar – im Supabase Dashboard unter *Database → Tables* bzw. per `pg_dump --schema-only` prüfen.
2. **Mandantenfähigkeit**: Die Models enthalten kein `user_id`. Falls alle freigeschalteten Nutzer dieselben
   Daten sehen (gemeinsames Tagebuch), bleibt das so. Falls RLS pro Nutzer trennt, bekommt jede Tabelle eine
   Spalte `owner_email` (aus dem Access-JWT befüllt) – siehe Schritt 4.
3. **Domain**: eigene Domain/Subdomain in Cloudflare oder `*.workers.dev`. Access funktioniert mit beiden.

## 4. Umsetzung in Phasen

### Phase 0 – Vorbereitung (≈ 0,5 h)

- [ ] Branch für die Migration anlegen.
- [ ] `wrangler` als devDependency installieren: `npm i -D wrangler @cloudflare/workers-types jose`.
- [ ] `npx wrangler login`.
- [ ] Vollständigen Supabase-Export ziehen und sicher ablegen (Sicherheitsnetz, siehe Phase 2).

### Phase 1 – D1-Datenbank & Schema (≈ 1 h)

- [ ] `npx wrangler d1 create coffeediary`
- [ ] Migration `migrations/0001_init.sql` anlegen (Entwurf, gegen Supabase-Schema abgleichen):

```sql
CREATE TABLE espressos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL,
  vendor          TEXT    NOT NULL DEFAULT '',
  gramms          REAL,
  ratio           REAL,
  grinder_setting REAL,
  runtime         REAL,
  archived        INTEGER NOT NULL DEFAULT 0,          -- boolean 0/1
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE espresso_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  espresso_id     INTEGER NOT NULL REFERENCES espressos(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  runtime         REAL,
  output          REAL,
  grinder_setting REAL,
  gramms          REAL
);
CREATE INDEX idx_espresso_pulls_espresso ON espresso_pulls(espresso_id, created_at);

CREATE TABLE handbrews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  vendor     TEXT    NOT NULL DEFAULT '',
  archived   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE handbrew_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  handbrew_id     INTEGER NOT NULL REFERENCES handbrews(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  recipe_key      TEXT    NOT NULL CHECK (recipe_key IN ('recipe_1','recipe_2')),
  grinder_setting REAL,
  beans_g         REAL,
  infusions       INTEGER,
  infusion_ml     REAL,
  output_ml       REAL
);
CREATE INDEX idx_handbrew_pulls_handbrew ON handbrew_pulls(handbrew_id, created_at);
```

  Falls Daten pro Nutzer getrennt werden müssen: `owner_email TEXT NOT NULL` in `espressos` und `handbrews`
  ergänzen und in jeder Query filtern.

- [ ] Lokal anwenden: `npx wrangler d1 migrations apply coffeediary --local`

Hinweise zu SQLite/D1:
- Boolean → `INTEGER` 0/1; der Worker mappt zurück auf `true/false`, damit die Angular-Models unverändert
  bleiben.
- Foreign Keys sind in D1 standardmäßig aktiv → `ON DELETE CASCADE` greift.
- Timestamps als ISO-8601-Text → Angulars `date`-Pipe funktioniert weiterhin.

### Phase 2 – Datenmigration (≈ 1 h)

1. Daten aus Supabase exportieren – je Tabelle **nur Daten**, IDs beibehalten:
   ```bash
   pg_dump "<supabase-connection-string>" --data-only --column-inserts --no-owner \
     -t public.espressos -t public.espresso_pulls -t public.handbrews -t public.handbrew_pulls \
     > supabase-data.sql
   ```
   (Alternativ CSV-Export im Supabase Table Editor + kleines Skript, das `INSERT`s erzeugt.)
2. Dump für SQLite bereinigen: `SET …`-/`SELECT pg_catalog…`-Zeilen und `public.`-Präfixe entfernen,
   `true/false` → `1/0`, Timestamps ggf. auf ISO-Format normalisieren. Reihenfolge: Kopf-Tabellen vor
   Pull-Tabellen.
3. Lokal testen: `npx wrangler d1 execute coffeediary --local --file=supabase-data.sql`
4. Plausibilität prüfen: `SELECT COUNT(*)` je Tabelle mit Supabase vergleichen, Stichproben in der App.
5. Erst in Phase 6 (Cutover) gegen `--remote` ausführen.

`AUTOINCREMENT` setzt sich nach expliziten ID-Inserts automatisch hinter die höchste ID – kein manuelles
Sequence-Reset nötig.

### Phase 3 – Worker-API (≈ 3–4 h)

Neue Struktur:

```
worker/
  index.ts          # Router: /api/* → Handler, sonst env.ASSETS
  auth.ts           # Access-JWT prüfen (jose + JWKS von <team>.cloudflareaccess.com)
  espressos.ts
  handbrews.ts
migrations/
  0001_init.sql
wrangler.jsonc
```

`wrangler.jsonc` (Entwurf):

```jsonc
{
  "name": "coffeediary",
  "main": "worker/index.ts",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist/coffeediary/browser",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "d1_databases": [
    { "binding": "DB", "database_name": "coffeediary", "database_id": "<aus wrangler d1 create>" }
  ],
  "vars": {
    "ACCESS_TEAM_DOMAIN": "https://<team>.cloudflareaccess.com",
    "ACCESS_AUD": "<Application Audience Tag>"
  }
}
```

Endpunkte (1:1 aus den bestehenden Service-Methoden abgeleitet):

| Methode & Pfad                                | ersetzt                                   |
| --------------------------------------------- | ----------------------------------------- |
| `GET    /api/espressos?archived=0\|1`         | `getAll()` / `getArchived()` (inkl. Pulls) |
| `GET    /api/espressos/:id`                   | `getById()`                               |
| `POST   /api/espressos`                       | `create()`                                |
| `PATCH  /api/espressos/:id`                   | `update()`, `updateDefaultRecipe()`, `setArchived()` |
| `DELETE /api/espressos/:id`                   | `delete()`                                |
| `GET    /api/espressos/:id/pulls`             | `getAllExtractions()`                     |
| `POST   /api/espressos/:id/pulls`             | `createEspressoPull()`                    |
| analog `/api/handbrews…`                      | `SupabaseHandbrewsService`                |
| `GET    /api/me`                              | E-Mail/Name aus Access-JWT für die Toolbar |

Umsetzungsdetails:
- **Nested Pulls**: zwei Queries (Köpfe, dann alle Pulls `WHERE espresso_id IN (…)`) per `env.DB.batch()` und
  im Worker gruppieren – liefert exakt die heutige Form `{…, espresso_pulls: [...]}`.
- **Whitelist für Spalten** bei `POST`/`PATCH` (kein blindes Durchreichen von Request-Feldern in SQL),
  ausschließlich Prepared Statements mit `.bind()`.
- **Auth-Check** als erstes in jedem `/api`-Request: JWT aus `Cf-Access-Jwt-Assertion` mit `jose`
  (`createRemoteJWKSet` + `jwtVerify`, `audience = ACCESS_AUD`) prüfen, sonst `401`. Schützt auch dann, wenn
  die Access-Policy einmal falsch konfiguriert ist.
- `POST`/`PATCH`/`DELETE` geben wie bisher das betroffene Objekt als Array zurück (`RETURNING *`), damit die
  Komponenten unverändert bleiben.

### Phase 4 – Angular umbauen (≈ 2–3 h)

- [ ] `provideHttpClient(withFetch())` in `app.config.ts`.
- [ ] `src/app/backend/espressos.api.ts` und `handbrews.api.ts` als Ersatz der Supabase-Services –
  **gleiche öffentlichen Methodensignaturen** (async/Promise, z. B. via `firstValueFrom(http.get…)`), dann
  ändern sich in den Komponenten nur die Imports/Klassennamen.
- [ ] `supabase-auth.service.ts` → `auth.service.ts`:
  - `user` als Signal, befüllt über `GET /api/me`.
  - `isLoggedIn` = `/api/me` liefert 200. Den Login-Screen in `app.ts` braucht es praktisch nicht mehr, weil
    Access vor der App sitzt; als Fallback bleibt ein Button, der die Seite neu lädt.
  - `signOut()` → `window.location.href = '/cdn-cgi/access/logout'`.
- [ ] `<script src="https://accounts.google.com/gsi/client">` aus `index.html` entfernen.
- [ ] `/coffeediary`-Base-Path-Logik entfällt (App läuft an der Domain-Wurzel, `<base href="/">` passt bereits).
- [ ] `@supabase/supabase-js` und `angular-cli-ghpages` deinstallieren, `deploy`-Target aus `angular.json`
  entfernen, Supabase-Eintrag aus `.mcp.json` entfernen.
- [ ] Lokale Entwicklung: `proxy.conf.json` (`/api` → `http://localhost:8787`) in `angular.json` → `serve`
  eintragen; parallel `npx wrangler dev` (lokale D1). Im Dev-Modus prüft der Worker das JWT nicht, sondern nutzt
  eine feste Dev-E-Mail (nur wenn `env.DEV === "true"`, gesetzt in `.dev.vars`).
- [ ] npm-Scripts ergänzen:
  ```json
  "dev:api": "wrangler dev",
  "deploy": "ng build && wrangler deploy",
  "db:migrate": "wrangler d1 migrations apply coffeediary --remote"
  ```
- [ ] Tests (`npm test`) anpassen: Services mit `provideHttpClientTesting()` mocken.

### Phase 5 – Cloudflare Access & Deployment (≈ 1 h)

1. Zero Trust Dashboard → *Settings → Authentication* → **Google** als Login-Methode hinzufügen
   (Google-Cloud-OAuth-Client; der bisherige aus Supabase kann wiederverwendet werden, Redirect-URI
   `https://<team>.cloudflareaccess.com/cdn-cgi/access/callback` ergänzen).
2. *Access → Applications* → Self-hosted App für `coffeediary.<domain>` (bzw. workers.dev-Hostname anlegen
   über *Worker → Settings → Domains → Cloudflare Access aktivieren*).
   - Policy *Allow*: Include → Emails = Liste der freigeschalteten Nutzer.
   - Session Duration großzügig (z. B. 1 Monat) – angenehm auf dem Smartphone.
   - **Application Audience (AUD) Tag** kopieren → `ACCESS_AUD`.
3. Erst-Deployment: `npm run db:migrate && npm run deploy`.
4. CI/CD: Im Worker unter *Settings → Builds* das GitHub-Repo verbinden
   (Build-Command `npm ci && npm run build`, Deploy-Command `npx wrangler deploy`), Branch `main`.
   Preview-Deployments für PR-Branches optional aktivieren (ebenfalls durch Access schützen!).
   Alternative: GitHub Action mit `cloudflare/wrangler-action` und API-Token als Repo-Secret.

### Phase 6 – Cutover (≈ 30 min)

1. In Supabase nichts mehr erfassen (kurzer „Freeze“).
2. Frischen Daten-Export ziehen (Phase 2, Schritte 1–2).
3. `npx wrangler d1 execute coffeediary --remote --file=supabase-data.sql`
4. Zeilenzahlen vergleichen, App auf dem Smartphone durchklicken: Liste, Archiv, neuer Pull, Edit, Archivieren,
   Löschen – für Espresso und Handbrew.
5. Auf dem Handy das neue Lesezeichen/Homescreen-Icon anlegen.

### Phase 7 – Rückbau (nach 2–4 Wochen stabilem Betrieb)

- [ ] GitHub Pages deaktivieren (*Repo → Settings → Pages*), Branch `gh-pages` löschen.
- [ ] Optional: auf der alten Pages-URL eine `index.html` mit Redirect auf die neue Domain belassen, statt
  sofort abzuschalten.
- [ ] Supabase-Projekt erst **pausieren**, nach Ablauf der Karenzzeit letzten Export archivieren und Projekt
  **löschen**. Damit ist auch der in der Git-Historie liegende anon key wertlos.
- [ ] Google-OAuth-Client: Supabase-Redirect-URI entfernen.
- [ ] `CLAUDE.md` und `README.md` aktualisieren (Architektur, Commands, keine Supabase-Hinweise mehr).

## 5. Risiken & Gegenmaßnahmen

| Risiko                                               | Gegenmaßnahme                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Typ-/Format-Unterschiede Postgres → SQLite           | Schema vorab verifizieren, lokaler Import-Testlauf, Count-Vergleich    |
| Access-Policy falsch → App offen                     | Worker prüft JWT zusätzlich selbst; nach Deploy im Inkognito-Tab testen |
| Datenverlust                                         | Supabase-Dump archivieren, Supabase erst nach Karenzzeit löschen, D1 Time Travel |
| Access-Login auf iOS-Homescreen-Web-App              | lange Session Duration; ggf. als normales Browser-Lesezeichen nutzen   |
| Rollback nötig                                       | GitHub-Pages-Deployment + Supabase bleiben bis Phase 7 unverändert lauffähig |

## 6. Kosten

Alles im Cloudflare Free Tier: Workers (100k Requests/Tag), D1 (5 GB, 5 Mio. Reads/Tag), Access (bis 50 Nutzer).
Static-Asset-Requests sind kostenlos und zählen nicht gegen das Worker-Limit.

## 7. Aufwand gesamt

ca. **1–1,5 Tage**, davon der größte Teil für Worker-API und Angular-Services. Die Komponenten selbst bleiben
weitgehend unangetastet, weil die Service-Signaturen erhalten bleiben.
