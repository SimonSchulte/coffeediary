export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /** OAuth-Client-ID (Web-Client) aus der Google Cloud Console; `aud` der Google-ID-Tokens. */
  GOOGLE_CLIENT_ID: string;
  /** Kommagetrennte Origins, die die API cross-origin aufrufen dürfen (z. B. Capacitor `https://localhost`). */
  ALLOWED_ORIGINS: string;
  /** Secret zum Signieren der Session-Tokens (`wrangler secret put SESSION_SECRET`). */
  SESSION_SECRET: string;
  /** Nur lokal (`.dev.vars`): überspringt den Login und nutzt diese E-Mail. Niemals in Produktion setzen. */
  DEV_USER_EMAIL?: string;
}
