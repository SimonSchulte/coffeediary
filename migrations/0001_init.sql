-- Initiales Schema für D1, abgeleitet aus dem Supabase-Schema (Stand 2026-10-15).
-- Booleans als INTEGER 0/1, Timestamps als ISO-8601-Text (UTC).

-- Freigeschaltete Nutzer (ersetzt die Nutzerverwaltung von Supabase Auth)
CREATE TABLE users (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE espressos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL,
  vendor          TEXT,
  gramms          REAL    NOT NULL DEFAULT 18,
  ratio           REAL    NOT NULL DEFAULT 2,
  grinder_setting REAL    NOT NULL,
  runtime         REAL    NOT NULL DEFAULT 25,
  output          REAL,
  archived        INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE espresso_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  espresso_id     INTEGER NOT NULL REFERENCES espressos(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
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
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE handbrew_pulls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  handbrew_id     INTEGER NOT NULL REFERENCES handbrews(id) ON DELETE CASCADE,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  recipe_key      TEXT    NOT NULL CHECK (recipe_key IN ('recipe_1', 'recipe_2')),
  grinder_setting REAL    NOT NULL,
  beans_g         REAL    NOT NULL,
  infusions       INTEGER NOT NULL,
  infusion_ml     REAL    NOT NULL,
  output_ml       REAL    NOT NULL
);
CREATE INDEX idx_handbrew_pulls_handbrew ON handbrew_pulls(handbrew_id, created_at);
