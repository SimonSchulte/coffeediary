# Migrationsplan: Coffeediary → Cloudflare (+ Android-App)

Ziel: Coffeediary vollständig auf den eigenen Cloudflare-Account umziehen, **Supabase** (Datenbank + Auth)
und **GitHub Pages** (Hosting) ablösen und dabei die Basis für eine **Android-App (Capacitor)** mit Fotos und
einer Café-Sammlung legen.

## Status (2026-10-15)

| Schritt | Stand |
| --- | --- |
| Lese-Leck `espresso_pulls` in Supabase | ✅ Read-Policy auf `authenticated` eingeschränkt |
| Phase 1 – D1 `coffeediary` + Schema | ✅ angelegt (WEUR), `migrations/0001_init.sql` angewendet und in `d1_migrations` vermerkt |
| Phase 2 – Daten | ✅ Erstimport (6/9/2/1 Zeilen + 3 Nutzer), Zeilenzahlen geprüft. **Beim Cutover neu importieren** (vorher Tabellen leeren), falls in Supabase noch etwas erfasst wurde |
| Phase 3 – Worker (`worker/`, `wrangler.jsonc`) | ✅ implementiert, lokal mit `wrangler dev` getestet (CRUD, Cascade, Constraints → 400, Auth/Allow-List, CORS, Origin-Check) – **noch nicht deployt** |
| Phase 4 – Angular umbauen | ⏳ offen |
| Phase 5 – `GOOGLE_CLIENT_ID` eintragen, `SESSION_SECRET` setzen, Deploy | ⏳ offen |

Lokal entwickeln: `.dev.vars` mit `SESSION_SECRET=<≥32 Zeichen>` anlegen (optional `DEV_USER_EMAIL=<freigeschaltete
Adresse>` zum Überspringen des Logins), `npx wrangler d1 migrations apply coffeediary --local`, `npm run build`,
`npm run dev:api`.

## 1. Ausgangslage (Ist-Zustand)

| Bereich       | Heute                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------- |
| Hosting       | GitHub Pages via `angular-cli-ghpages` (`ng deploy`), Base-Path `/coffeediary/`          |
| Datenbank     | Supabase Postgres, Tabellen `espressos`, `espresso_pulls`, `handbrews`, `handbrew_pulls` |
| Datenzugriff  | direkt aus dem Browser per `@supabase/supabase-js` (anon key, Schutz nur über RLS)        |
| Auth          | Google-Login über **Supabase Auth** (OAuth-Redirect, Session-Verwaltung durch Supabase)   |
| Konfiguration | URL + anon key **hart codiert** in 3 Dateien                                             |

Betroffene Dateien:

- `src/app/backend/supabase.espressos.service.ts`
- `src/app/backend/supabase.handbrews.service.ts`
- `src/app/services/supabase-auth.service.ts` (genutzt von `app.ts` und `ui/app-toolbar.component.ts`)
- `src/index.html` (lädt bereits `accounts.google.com/gsi/client` – wird künftig tatsächlich genutzt)
- `angular.json` (`deploy`-Target), `package.json` (`angular-cli-ghpages`, `@supabase/supabase-js`)
- `.mcp.json` (Supabase-MCP)

Cloudflare-Account: bereits vorhanden (Workers `stationwizard`, `hiorg-oidc-bridge`, mehrere D1-Datenbanken).
Für Coffeediary existieren noch keine Ressourcen.

## 2. Zielarchitektur

```
 Web (Browser)                         Android-App (Capacitor, gleiche Angular-Codebasis)
 https://coffeediary.<sub>.workers.dev  WebView-Origin https://localhost
   │  Google Identity Services            │  nativer Google-Login (Credential Manager)
   │  Session-Cookie                      │  Bearer-Token
   └──────────────┬───────────────────────┘
                  ▼
        Worker "coffeediary"  (https://coffeediary.<sub>.workers.dev)
          ├─ /api/auth/*  → Google-ID-Token prüfen, Allow-List, Session ausstellen
          ├─ /api/*       → REST-API (Session prüfen, CORS für die App)
          │                   ├─► D1 "coffeediary"       (Daten)
          │                   ├─► R2 "coffeediary-photos" (Fotos, Ausbaustufe 2)
          │                   └─► Google Places API       (Cafés, Ausbaustufe 3, Key als Secret)
          └─ alles andere → Static Assets (Angular-Build, SPA-Fallback)
```

| Baustein   | Lösung                                                       | Ersetzt                  |
| ---------- | ------------------------------------------------------------ | ------------------------ |
| Hosting    | **Workers Static Assets** (SPA-Modus)                        | GitHub Pages             |
| API        | **Worker** unter `/api/*`                                    | supabase-js / PostgREST  |
| Datenbank  | **D1** (SQLite)                                              | Supabase Postgres        |
| Auth       | **Google-Login, im Worker verifiziert** + eigene Session     | Supabase Auth            |
| Dateien    | **R2** (später)                                              | –                        |
| Android    | **Capacitor** (später)                                       | –                        |
| CI/CD      | **Workers Builds** (Git-Integration); APK per GitHub Action  | `ng deploy` / gh-pages   |
| Backups    | D1 Time Travel + optionaler Export                           | Supabase Backups         |

### Warum diese Entscheidungen

- **Workers statt Pages**: Cloudflare führt Pages in Workers zusammen; ein Worker liefert Frontend *und* API
  aus – eine Deployment-Einheit.
- **D1**: kleines, relationales Datenmodell (Kopf/Positionen), passt 1:1 auf SQLite; Free Tier reicht.
- **Eigener Google-Login statt Cloudflare Access**: Die Android-App liefert ihr Frontend lokal aus und ruft die
  API von einer fremden Origin auf – ein vorgeschalteter Access-Login passt dazu nicht. Der bestehende
  **Google-OAuth-Client** (Google Cloud Console) wird weiterverwendet; nur die Prüfung des Logins wandert von
  Supabase in den Worker. Für Nutzer sieht der Login praktisch gleich aus.
- **Capacitor statt nativer Neuentwicklung**: Der Angular-Code (Material, Signals, Komponenten) bleibt;
  Kamera, Standort, Teilen-Ziel usw. kommen als Plugins. Native Spezialfälle (Widget, Hintergrund-Standort)
  lassen sich später als einzelnes Plugin nachrüsten.

## 3. Offene Punkte vor dem Start

1. ~~Supabase-Schema verifizieren~~ **erledigt (Stand 2026-10-15)**, Ergebnis siehe Abschnitt 3a.
2. ~~Gemeinsame oder getrennte Daten?~~ **geklärt: gemeinsam.** Es gibt keine `user_id`-Spalten; alle RLS-Policies
   erlauben jedem angemeldeten Nutzer alles (`USING true`). Das bleibt so – Zugriff steuert allein die
   Allow-List in `users`. Eine Trennung pro Nutzer (`owner_email`) kann später nachgerüstet werden.
3. ~~Domain~~ **entschieden**: Start auf `https://coffeediary.<sub>.workers.dev` (`<sub>` = workers.dev-Subdomain
   des Accounts, siehe *Workers & Pages → Übersicht*). Eine eigene Domain kann später ergänzt werden – dann
   API-Basis-URL der App, `ALLOWED_ORIGINS` und die *Authorized JavaScript origins* im Google-Client anpassen.
   Deshalb die URL nirgends hart codieren, sondern zentral konfigurieren.
4. **Google-OAuth-Client-ID** aus der Google Cloud Console heraussuchen (ist heute im Supabase-Dashboard unter
   *Authentication → Providers → Google* hinterlegt).

## 3a. Befund aus Supabase (2026-10-15)

Das Projekt war im Free Tier **pausiert** und wurde für die Analyse wiederhergestellt. Free-Projekte pausieren nach
ca. 7 Tagen Inaktivität erneut – den Daten-Export (Phase 2) daher zeitnah ziehen.

**Datenmenge** (sehr klein, Migration per Skript trivial):

| Tabelle          | Zeilen |
| ---------------- | ------ |
| `espressos`      | 6      |
| `espresso_pulls` | 9      |
| `handbrews`      | 2      |
| `handbrew_pulls` | 1      |
| `auth.users`     | 3 (alle Google-Login) → werden die Einträge der D1-Tabelle `users` |

**Schema-Abweichungen gegenüber den TypeScript-Models:**

- `espressos.output` (bigint, nullable) existiert in der DB, aber nicht im Model; 1 Zeile hat einen Wert →
  Spalte in D1 übernehmen, damit nichts verloren geht.
- `espressos.vendor` ist nullable (aktuell keine NULLs), `handbrews.vendor` NOT NULL.
- `handbrews` hat **kein** `created_at`; in D1 mit Default ergänzt (Altdaten bekommen den Importzeitpunkt).
- Defaults: `espressos.gramms = 18`, `ratio = 2`, `runtime = 25` → in D1 übernehmen.
- IDs sind Identity-Spalten; Werte werden beim Import beibehalten.
- `espresso_pulls.espresso_id` ist nullable (keine verwaisten Zeilen) → in D1 `NOT NULL`.

**Auffälligkeiten (werden durch die Migration behoben):**

- **`espresso_pulls` ist öffentlich lesbar**: Die Read-Policy gilt für alle Rollen inkl. `anon`; mit dem anon key
  aus dem Repo kann jeder die Pulls lesen. Bis zur Abschaltung ggf. auf `authenticated` einschränken.
- **Espresso löschen funktioniert heute nicht**: `espressos` hat keine DELETE-Policy, und
  `espresso_pulls.espresso_id` hat kein `ON DELETE CASCADE`. `delete()` liefert still ein leeres Ergebnis.
  In D1 mit `ON DELETE CASCADE` (wie bei `handbrew_pulls`) – Löschen eines Espresso entfernt dann auch seine Pulls.
- `espresso_pulls` hat keine UPDATE/DELETE-Policy (die App nutzt das aktuell auch nicht).

## 4. Phasen

Teil A ist die eigentliche Migration (Web-App läuft danach komplett auf Cloudflare). Teil B sind die
Ausbaustufen; jede liefert eine lauffähige App.

---

## Teil A – Migration

### Phase 0 – Vorbereitung (≈ 0,5 h)

- [ ] Branch für die Migration anlegen.
- [ ] `npm i -D wrangler @cloudflare/workers-types` und `npm i jose` (JWT-Prüfung im Worker).
- [ ] `npx wrangler login`.
- [ ] Vollständigen Supabase-Export ziehen und sicher ablegen (Sicherheitsnetz, siehe Phase 2).

### Phase 1 – D1-Datenbank & Schema (≈ 1 h)

- [ ] `npx wrangler d1 create coffeediary`
- [ ] Migration `migrations/0001_init.sql` (Entwurf, gegen Supabase-Schema abgleichen):

```sql
-- Freigeschaltete Nutzer (ersetzt die Nutzerverwaltung von Supabase Auth)
CREATE TABLE users (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE espressos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL,
  vendor          TEXT,
  gramms          REAL    NOT NULL DEFAULT 18,
  ratio           REAL    NOT NULL DEFAULT 2,
  grinder_setting REAL    NOT NULL,
  runtime         REAL    NOT NULL DEFAULT 25,
  output          REAL,                                 -- existiert in Supabase, (noch) nicht im Model
  archived        INTEGER NOT NULL DEFAULT 0,          -- boolean 0/1
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE espresso_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  espresso_id     INTEGER NOT NULL REFERENCES espressos(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  runtime         REAL    NOT NULL,
  output          REAL,
  grinder_setting REAL,
  gramms          REAL
);
CREATE INDEX idx_espresso_pulls_espresso ON espresso_pulls(espresso_id, created_at);

CREATE TABLE handbrews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  vendor     TEXT    NOT NULL,
  archived   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE handbrew_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  handbrew_id     INTEGER NOT NULL REFERENCES handbrews(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  recipe_key      TEXT    NOT NULL CHECK (recipe_key IN ('recipe_1','recipe_2')),
  grinder_setting REAL    NOT NULL,
  beans_g         REAL    NOT NULL,
  infusions       INTEGER NOT NULL,
  infusion_ml     REAL    NOT NULL,
  output_ml       REAL    NOT NULL
);
CREATE INDEX idx_handbrew_pulls_handbrew ON handbrew_pulls(handbrew_id, created_at);
```

  Bei getrennten Daten pro Nutzer: `owner_email TEXT NOT NULL REFERENCES users(email)` in `espressos` und
  `handbrews` ergänzen und in jeder Query filtern.

- [ ] Lokal anwenden: `npx wrangler d1 migrations apply coffeediary --local`
- [ ] Freigeschaltete Nutzer eintragen: `INSERT INTO users (email, name) VALUES (…)`.

Hinweise zu SQLite/D1:
- Boolean → `INTEGER` 0/1; der Worker mappt auf `true/false`, die Angular-Models bleiben unverändert.
- Foreign Keys sind in D1 aktiv → `ON DELETE CASCADE` greift.
- Timestamps als ISO-8601-Text → Angulars `date`-Pipe funktioniert weiterhin.

### Phase 2 – Datenmigration (≈ 0,5 h)

Bei 18 Zeilen gibt es zwei Wege. **Empfohlen (einfach):** die `INSERT`-Statements direkt in Supabase per SQL
erzeugen lassen (SQL-Editor oder Supabase-MCP), z. B.
`SELECT format('INSERT INTO espressos (id,name,…) VALUES (%s,%L,…);', id, name, …) FROM espressos ORDER BY id;`
und das Ergebnis als `supabase-data.sql` speichern. Alternativ der klassische Weg:

1. Daten aus Supabase exportieren (nur Daten, IDs beibehalten):
   ```bash
   pg_dump "<supabase-connection-string>" --data-only --column-inserts --no-owner \
     -t public.espressos -t public.espresso_pulls -t public.handbrews -t public.handbrew_pulls \
     > supabase-data.sql
   ```
   (Alternativ CSV-Export im Supabase Table Editor + kleines Skript, das `INSERT`s erzeugt.)
2. Dump für SQLite bereinigen: `SET …`-/`SELECT pg_catalog…`-Zeilen und `public.`-Präfixe entfernen,
   `true/false` → `1/0`, Timestamps auf ISO-Format normalisieren. Kopf-Tabellen vor Pull-Tabellen.
3. Lokal testen: `npx wrangler d1 execute coffeediary --local --file=supabase-data.sql`
4. `SELECT COUNT(*)` je Tabelle mit Supabase vergleichen, Stichproben in der App.
5. Gegen `--remote` erst beim Cutover (Phase 6).

`AUTOINCREMENT` setzt sich nach expliziten ID-Inserts automatisch hinter die höchste ID.

### Phase 3 – Worker: Auth & API (≈ 4–5 h)

Struktur:

```
worker/
  index.ts          # Router, CORS, /api/* → Handler, sonst env.ASSETS
  auth.ts           # Google-ID-Token prüfen, Session-JWT ausstellen/prüfen
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
  "workers_dev": true,
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
    "GOOGLE_CLIENT_ID": "<Web-Client-ID>.apps.googleusercontent.com",
    "ALLOWED_ORIGINS": "https://localhost,http://localhost:4200"
  }
  // Secret: npx wrangler secret put SESSION_SECRET
}
```

#### Login-Ablauf

```
Client (Web: Google Identity Services | App: natives Google-Plugin)
  → erhält Google-ID-Token (JWT, aud = Web-Client-ID)
  → POST /api/auth/google { idToken }
Worker
  1. jose.jwtVerify(idToken, createRemoteJWKSet('https://www.googleapis.com/oauth2/v3/certs'),
       { issuer: ['https://accounts.google.com','accounts.google.com'], audience: GOOGLE_CLIENT_ID })
  2. email_verified === true und E-Mail in Tabelle users → sonst 403
  3. Session-JWT (HS256, SESSION_SECRET, 30 Tage, sub = E-Mail) ausstellen
     - Web:  Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax; Path=/
     - App:  { token } im Body → Ablage via @capacitor/preferences, Versand als Authorization: Bearer
```

- Jede `/api`-Anfrage (außer `/api/auth/google`) prüft Cookie **oder** Bearer-Token und, dass die E-Mail noch
  in `users` steht → Nutzer entfernen = Zugriff sofort weg.
- `POST /api/auth/logout` löscht das Cookie; die App verwirft ihr Token.
- `GET /api/me` liefert E-Mail/Name/Bild für die Toolbar.
- **CORS**: nur Origins aus `ALLOWED_ORIGINS` (Capacitor-Android nutzt `https://localhost`), Header
  `Authorization, Content-Type`, Preflight (`OPTIONS`) beantworten. Kein `credentials: include` nötig, da die
  App Bearer-Tokens nutzt.

#### Endpunkte (aus den bestehenden Service-Methoden abgeleitet)

| Methode & Pfad                         | ersetzt                                                 |
| -------------------------------------- | ------------------------------------------------------- |
| `POST   /api/auth/google`              | `signInWithGoogle()`                                    |
| `POST   /api/auth/logout`              | `signOut()`                                             |
| `GET    /api/me`                       | `user$` / `getUser()`                                   |
| `GET    /api/espressos?archived=0\|1`  | `getAll()` / `getArchived()` (inkl. Pulls)              |
| `GET    /api/espressos/:id`            | `getById()`                                             |
| `POST   /api/espressos`                | `create()`                                              |
| `PATCH  /api/espressos/:id`            | `update()`, `updateDefaultRecipe()`, `setArchived()`    |
| `DELETE /api/espressos/:id`            | `delete()`                                              |
| `GET    /api/espressos/:id/pulls`      | `getAllExtractions()`                                   |
| `POST   /api/espressos/:id/pulls`      | `createEspressoPull()`                                  |
| analog `/api/handbrews…`               | `SupabaseHandbrewsService`                              |

Umsetzungsdetails:
- **Nested Pulls**: Köpfe und zugehörige Pulls per `env.DB.batch()` laden und im Worker gruppieren → exakt die
  heutige Form `{…, espresso_pulls: [...]}`.
- **Spalten-Whitelist** bei `POST`/`PATCH`, ausschließlich Prepared Statements mit `.bind()`.
- `POST`/`PATCH`/`DELETE` liefern wie bisher das Objekt als Array (`RETURNING *`).
- Lokale Entwicklung: `.dev.vars` mit `SESSION_SECRET` (nicht committen, in `.gitignore`).

### Phase 4 – Angular umbauen (≈ 3 h)

- [ ] `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))` in `app.config.ts`.
- [ ] **API-Basis-URL** als InjectionToken: Web → `/api` (relativ), App → `https://coffeediary.<sub>.workers.dev/api`
  (zentral in einer Environment-Datei, damit ein späterer Domain-Wechsel nur eine Stelle betrifft)
  (Erkennung später über `Capacitor.isNativePlatform()`; bis dahin fest `/api`).
- [ ] `authInterceptor`: setzt `Authorization: Bearer …`, falls ein Token vorhanden ist (nur App); bei `401`
  → Login-Screen.
- [ ] `src/app/backend/espressos.api.ts` und `handbrews.api.ts` ersetzen die Supabase-Services – **gleiche
  öffentliche Methodensignaturen** (Promise via `firstValueFrom`), damit sich in den Komponenten nur
  Imports/Klassennamen ändern.
- [ ] `supabase-auth.service.ts` → `auth.service.ts`:
  - `user` als Signal (aus `GET /api/me`), `loggedIn` als `computed`.
  - Web-Login: „Sign in with Google“-Button von Google Identity Services (Script ist in `index.html` schon
    eingebunden) → ID-Token an `/api/auth/google`.
  - `signOut()` → `POST /api/auth/logout`.
  - Die Plattform-Weiche (Web vs. natives Plugin) so kapseln, dass Phase 7 nur eine weitere Implementierung
    ergänzt.
- [ ] `/coffeediary`-Base-Path-Logik entfernen (App läuft an der Domain-Wurzel; `<base href="/">` passt).
- [ ] `@supabase/supabase-js` und `angular-cli-ghpages` deinstallieren, `deploy`-Target aus `angular.json`,
  Supabase-Eintrag aus `.mcp.json` entfernen.
- [ ] Dev-Setup: `proxy.conf.json` (`/api` → `http://localhost:8787`) im `serve`-Target, parallel
  `npx wrangler dev`.
- [ ] npm-Scripts:
  ```json
  "dev:api": "wrangler dev",
  "deploy": "ng build && wrangler deploy",
  "db:migrate": "wrangler d1 migrations apply coffeediary --remote"
  ```
- [ ] Tests (`npm test`): Services mit `provideHttpClientTesting()` mocken.

### Phase 5 – Google-Client & Deployment (≈ 1 h)

1. Google Cloud Console → *APIs & Services → Credentials* → bestehenden **Web-OAuth-Client**:
   - *Authorized JavaScript origins*: `https://coffeediary.<sub>.workers.dev` und `http://localhost:4200` ergänzen.
   - Client-ID → `GOOGLE_CLIENT_ID`. (Kein Client-Secret nötig – der ID-Token-Flow kommt ohne aus.)
2. `npx wrangler secret put SESSION_SECRET` (zufällig, ≥ 32 Byte).
3. workers.dev-Route aktiv lassen (`"workers_dev": true` in `wrangler.jsonc`, Standard). Eine Custom Domain
   kann später unter *Worker → Settings → Domains & Routes* ergänzt werden.
4. Erst-Deployment: `npm run db:migrate && npm run deploy`.
5. CI/CD: Worker → *Settings → Builds* mit dem GitHub-Repo verbinden (Build `npm ci && npm run build`,
   Deploy `npx wrangler deploy`, Branch `main`). Alternative: GitHub Action mit `cloudflare/wrangler-action`.

### Phase 6 – Cutover & Rückbau (≈ 30 min + Karenzzeit)

1. In Supabase nichts mehr erfassen, frischen Export ziehen (Phase 2, Schritte 1–2).
2. `npx wrangler d1 execute coffeediary --remote --file=supabase-data.sql`
3. Zeilenzahlen vergleichen; auf dem Smartphone durchklicken: Login, Liste, Archiv, neuer Pull, Edit,
   Archivieren, Löschen – für Espresso und Handbrew. Login mit nicht freigeschalteter Adresse → muss
   abgelehnt werden.
4. Neues Homescreen-Lesezeichen anlegen.

Nach 2–4 Wochen stabilem Betrieb:
- [ ] GitHub Pages deaktivieren, Branch `gh-pages` löschen (optional vorher eine Redirect-`index.html`).
- [ ] Supabase-Projekt erst pausieren, letzten Export archivieren, dann löschen – damit ist auch der anon key
  in der Git-Historie wertlos.
- [ ] Im Google-OAuth-Client die Supabase-Redirect-URI und die GitHub-Pages-Origin entfernen.
- [ ] `CLAUDE.md` und `README.md` aktualisieren.

---

## Teil B – Ausbaustufen

### Phase 7 – Android-App mit Capacitor (≈ 1 Tag)

- [ ] `npm i @capacitor/core @capacitor/android && npm i -D @capacitor/cli`
- [ ] `npx cap init Coffeediary <app-id, z. B. de.<name>.coffeediary> --web-dir dist/coffeediary/browser`
- [ ] `npx cap add android` → Ordner `android/` wird committet.
- [ ] Login nativ: Google-Login-Plugin auf Basis des Android Credential Managers (z. B.
  `@capgo/capacitor-social-login`; zum Zeitpunkt der Umsetzung Pflegestand prüfen). Als `serverClientId` die
  **Web-Client-ID** verwenden, damit das ID-Token dieselbe `aud` hat und der Worker unverändert bleibt.
- [ ] Google Cloud Console: zusätzlichen **Android-OAuth-Client** mit Paketname + SHA-1 des Debug- und des
  Release-Signierschlüssels anlegen.
- [ ] Token-Ablage mit `@capacitor/preferences`; API-Basis-URL über `Capacitor.isNativePlatform()` umschalten.
- [ ] Safe-Areas/Statusleiste (`@capacitor/status-bar`), Zurück-Taste (`@capacitor/app`), Splash-Screen/Icon.
- [ ] Build: lokal mit Android Studio (`npx cap sync && npx cap open android`), später GitHub Action, die eine
  signierte APK/AAB baut (Keystore als Repo-Secret).
- [ ] Verteilung: APK direkt installieren oder Play Store (Developer-Konto, einmalig 25 $; interner Test-Track
  reicht für einen kleinen Nutzerkreis).

### Phase 8 – Fotos mit R2 (≈ 0,5–1 Tag)

- [ ] `npx wrangler r2 bucket create coffeediary-photos`, Binding `PHOTOS` in `wrangler.jsonc`.
- [ ] Migration `0002_photos.sql`:
  ```sql
  CREATE TABLE photos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    r2_key      TEXT NOT NULL UNIQUE,
    entity_type TEXT NOT NULL,              -- 'espresso' | 'handbrew' | 'cafe_visit' …
    entity_id   INTEGER NOT NULL,
    created_by  TEXT NOT NULL REFERENCES users(email),
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  CREATE INDEX idx_photos_entity ON photos(entity_type, entity_id);
  ```
- [ ] Endpunkte: `POST /api/photos` (Upload, Worker schreibt nach R2 + Zeile in `photos`),
  `GET /api/photos/:id` (Auslieferung nur mit gültiger Session, `Cache-Control: private`),
  `DELETE /api/photos/:id`.
- [ ] Client: `@capacitor/camera` (App) bzw. `<input type="file" accept="image/*" capture>` (Web); vor dem
  Upload auf ~1600 px Kantenlänge verkleinern und als JPEG/WebP komprimieren (spart Speicher und
  mobile Daten).
- [ ] Beim Löschen eines Espresso/Handbrews zugehörige Fotos in R2 mitlöschen.

### Phase 9 – Cafés / Collector (≈ 1–2 Tage)

- [ ] Migration `0003_cafes.sql`:
  ```sql
  CREATE TABLE cafes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id   TEXT UNIQUE,                 -- Google Place ID (darf dauerhaft gespeichert werden)
    name       TEXT NOT NULL,
    address    TEXT,
    lat        REAL,
    lng        REAL,
    notes      TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  CREATE TABLE cafe_visits (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    cafe_id    INTEGER NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    visited_at TEXT NOT NULL,
    rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
    drink      TEXT,
    notes      TEXT
  );
  ```
  Optional: `espressos.cafe_id` / `handbrews.cafe_id` (wo die Bohnen gekauft wurden).
- [ ] **Café-Suche** über die Google **Places API (New)**, ausschließlich aus dem Worker aufgerufen
  (`GOOGLE_PLACES_KEY` als Secret, Feldmasken sparsam halten → geringe Kosten):
  `GET /api/places/search?q=…&lat=…&lng=…`.
- [ ] **Maps-Link** aus `place_id` erzeugen (öffnet auf Android direkt die Maps-App):
  `https://www.google.com/maps/search/?api=1&query=<name>&query_place_id=<place_id>`
- [ ] **„In der Nähe“**: `@capacitor/geolocation` → Suche mit Standort-Bias.
- [ ] **Teilen aus Google Maps → Coffeediary**: Android-Intent-Filter für `text/plain` (Share-Target-Plugin);
  der geteilte `maps.app.goo.gl`-Link wird im Worker aufgelöst und per Places-Suche dem Café zugeordnet.
  (Die Web-Version kann das über `share_target` im Web-App-Manifest ebenfalls.)
- [ ] **Karte** aller besuchten Cafés: `@capacitor/google-maps` (nativ, App) bzw. Maps JavaScript API (Web).
- [ ] Hinweis Google-Nutzungsbedingungen: `place_id` darf dauerhaft gespeichert werden; weitere
  Places-Inhalte (Öffnungszeiten, Bewertungen …) bei Bedarf live abrufen statt dauerhaft zu speichern.
  Name/Adresse/Notizen, die du selbst bestätigst, sind deine eigenen Daten.

---

## 5. Risiken & Gegenmaßnahmen

| Risiko                                           | Gegenmaßnahme                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| Typ-/Format-Unterschiede Postgres → SQLite       | Schema vorab verifizieren, lokaler Import-Testlauf, Count-Vergleich        |
| Fehler in der eigenen Auth-Prüfung               | `jose` statt Eigenbau, `aud`/`iss`/`email_verified` prüfen, Allow-List in D1, Negativtest beim Cutover |
| Session-Token in der App abgegriffen             | nur HTTPS, begrenzte Laufzeit, Nutzer aus `users` entfernen sperrt sofort  |
| CORS zu offen                                    | feste Origin-Liste statt `*`                                               |
| Datenverlust                                     | Supabase-Dump archivieren, Supabase erst nach Karenzzeit löschen, D1 Time Travel |
| Rollback nötig                                   | GitHub Pages + Supabase bleiben bis Ende Phase 6 unverändert lauffähig     |
| Places-API-Kosten                                | nur über Worker, enge Feldmasken, Budget-Alarm in der Google Cloud         |

## 6. Kosten

- Cloudflare Free Tier: Workers (100k Requests/Tag), D1 (5 GB), R2 (10 GB Speicher, kein Egress-Entgelt).
  Static-Asset-Requests sind kostenlos.
- Google: Login kostenlos; Places API nutzungsbasiert mit monatlichem Freikontingent – für eine persönliche
  Café-Sammlung praktisch kostenlos, Budget-Alarm trotzdem setzen.
- Optional Play-Store-Konto: einmalig 25 $.

## 7. Aufwand

| Teil                               | Aufwand        |
| ---------------------------------- | -------------- |
| A – Migration (Phasen 0–6)         | ca. 1,5 Tage   |
| B – Android (Phase 7)              | ca. 1 Tag      |
| B – Fotos (Phase 8)                | ca. 0,5–1 Tag  |
| B – Cafés (Phase 9)                | ca. 1–2 Tage   |
