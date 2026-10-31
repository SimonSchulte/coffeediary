# To-do: Coffeediary live auf Cloudflare bringen

Schritte, die nur mit deinen Zugängen (Cloudflare, Google, GitHub) gehen. Code, Workflows, D1-Datenbank und
Erstimport der Daten sind fertig. Hintergrund: [`MIGRATION_CLOUDFLARE.md`](MIGRATION_CLOUDFLARE.md).

## 1. Cloudflare

- [ ] **API-Token anlegen**: Dashboard → *My Profile → API Tokens → Create Token* → Vorlage
      **„Edit Cloudflare Workers“** → unter *Permissions* zusätzlich **Account · D1 · Edit** → Token kopieren.
- [ ] **Account-ID notieren**: Dashboard → *Workers & Pages* → rechte Seitenleiste „Account ID“.
- [ ] **workers.dev-Subdomain notieren** (gleiche Seite, z. B. `simon` → App-URL
      `https://coffeediary.simon.workers.dev`). Falls noch keine existiert: dort einmalig anlegen.

## 2. Google Cloud Console

- [ ] *APIs & Services → Credentials* → bestehenden **Web-OAuth-Client** öffnen (derselbe, der heute in
      Supabase unter *Authentication → Providers → Google* hinterlegt ist).
- [ ] **Client-ID** kopieren (`….apps.googleusercontent.com`).
- [ ] Unter *Authorized JavaScript origins* ergänzen:
  - `https://coffeediary.<sub>.workers.dev`
  - `http://localhost:4200` (lokale Entwicklung)

## 3. GitHub → Settings → Secrets and variables → Actions

| Typ      | Name                    | Wert                                             |
| -------- | ----------------------- | ------------------------------------------------ |
| Secret   | `CLOUDFLARE_API_TOKEN`  | Token aus 1.                                     |
| Secret   | `CLOUDFLARE_ACCOUNT_ID` | Account-ID aus 1.                                |
| Secret   | `SESSION_SECRET`        | zufällig, z. B. Ausgabe von `openssl rand -hex 32` |
| Variable | `GOOGLE_CLIENT_ID`      | Client-ID aus 2.                                 |

- [ ] Alle vier angelegt.

## 4. Daten aktuell halten

- [ ] Prüfen, ob seit dem Erstimport (15.10.2026) noch etwas in der alten App erfasst wurde. Das
      Supabase-Projekt ist inzwischen wieder pausiert; zum Prüfen kurz wiederherstellen (oder Claude
      Bescheid geben) und Zeilenzahlen vergleichen. Stand D1: 6 Espressi, 9 Pulls, 2 Handbrews, 1 Aufguss.
- [ ] Falls ja: Daten neu nach D1 übernehmen (D1-Tabellen vorher leeren).

## 5. Erst-Deploy & Test

- [ ] *Actions → Deploy to Cloudflare → Run workflow* auf dem Branch dieses PRs starten
      (der Konfigurations-Check sagt genau, was ggf. noch fehlt).
- [ ] App auf dem Smartphone öffnen und durchklicken:
  - [ ] Login mit Google (alle drei freigeschalteten Konten möglich)
  - [ ] Espresso-Liste, Archiv, neuer Bezug, Bearbeiten, Archivieren, Wiederherstellen
  - [ ] Handbrews: Liste, neuer Aufguss, Archiv
  - [ ] Espresso löschen (ging unter Supabase nicht, entfernt jetzt auch die Bezüge)
  - [ ] Login mit einem **nicht** freigeschalteten Google-Konto → muss abgelehnt werden
- [ ] Homescreen-Lesezeichen auf die neue URL umstellen.
- [ ] PR mergen → ab dann deployt jeder Push auf `main` automatisch.

## 6. Rückbau (nach 2–4 Wochen stabilem Betrieb)

- [ ] GitHub Pages deaktivieren (*Repo → Settings → Pages*), Branch `gh-pages` löschen.
- [ ] Supabase: letzten Export archivieren, Projekt `coffeediary` löschen (damit ist auch der alte anon key in
      der Git-Historie wertlos).
- [ ] Google-OAuth-Client: Supabase-Redirect-URI und GitHub-Pages-Origin entfernen.
- [ ] `.mcp.json` (Supabase-MCP) und Supabase-Hinweise im `README.md` entfernen.

## Neue Nutzer freischalten

```bash
npx wrangler d1 execute coffeediary --remote \
  --command "INSERT INTO users (email, name) VALUES ('name@gmail.com', 'Name')"
```

Entfernen mit `DELETE FROM users WHERE email = '…'` – der Zugang ist dann sofort weg.
