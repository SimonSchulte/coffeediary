import {Env} from './env';
import {HttpError, json, readJson} from './http';

/**
 * Beschreibt eine Kopf-Tabelle (Espresso, Handbrew) mit ihren Bezügen/Aufgüssen.
 * Die JSON-Form entspricht dem, was supabase-js bisher geliefert hat, damit die Angular-Models gleich bleiben.
 */
interface ResourceConfig {
  table: string;
  fields: string[];
  booleanFields: string[];
  pulls: {
    table: string;
    /** Fremdschlüssel-Spalte, z. B. `espresso_id`. */
    parentKey: string;
    /** Name des verschachtelten Arrays im JSON, z. B. `espresso_pulls`. */
    jsonKey: string;
    fields: string[];
  };
}

export const RESOURCES: Record<string, ResourceConfig> = {
  espressos: {
    table: 'espressos',
    fields: ['name', 'vendor', 'gramms', 'ratio', 'grinder_setting', 'runtime', 'output', 'archived'],
    booleanFields: ['archived'],
    pulls: {
      table: 'espresso_pulls',
      parentKey: 'espresso_id',
      jsonKey: 'espresso_pulls',
      fields: ['runtime', 'output', 'grinder_setting', 'gramms'],
    },
  },
  handbrews: {
    table: 'handbrews',
    fields: ['name', 'vendor', 'archived'],
    booleanFields: ['archived'],
    pulls: {
      table: 'handbrew_pulls',
      parentKey: 'handbrew_id',
      jsonKey: 'handbrew_pulls',
      fields: ['recipe_key', 'grinder_setting', 'beans_g', 'infusions', 'infusion_ml', 'output_ml'],
    },
  },
};

type Row = Record<string, unknown>;

/** Routet `/api/<resource>[/<id>[/pulls]]`. */
export async function handleResource(
  request: Request,
  env: Env,
  config: ResourceConfig,
  id: number | null,
  sub: string | undefined,
): Promise<Response> {
  const method = request.method;

  if (id === null) {
    if (method === 'GET') {
      const archived = new URL(request.url).searchParams.get('archived') === '1';
      return json(await listWithPulls(env, config, archived));
    }
    if (method === 'POST') return json(await insert(env, config, await readJson(request)), {status: 201});
  } else if (sub === undefined) {
    if (method === 'GET') return json(await getById(env, config, id));
    if (method === 'PATCH') return json(await update(env, config, id, await readJson(request)));
    if (method === 'DELETE') return json(await remove(env, config, id));
  } else if (sub === 'pulls') {
    if (method === 'GET') return json(await listPulls(env, config, id));
    if (method === 'POST') {
      return json(await insertPull(env, config, id, await readJson(request)), {status: 201});
    }
  } else {
    throw new HttpError(404, 'Nicht gefunden');
  }
  throw new HttpError(405, 'Methode nicht erlaubt');
}

async function listWithPulls(env: Env, config: ResourceConfig, archived: boolean): Promise<Row[]> {
  const {table, pulls} = config;
  const [parents, children] = await env.DB.batch<Row>([
    env.DB.prepare(`SELECT * FROM ${table} WHERE archived = ? ORDER BY id`).bind(archived ? 1 : 0),
    env.DB.prepare(
      `SELECT p.* FROM ${pulls.table} p JOIN ${table} t ON t.id = p.${pulls.parentKey}
       WHERE t.archived = ? ORDER BY p.created_at`,
    ).bind(archived ? 1 : 0),
  ]);

  const byParent = new Map<unknown, Row[]>();
  for (const pull of children.results) {
    const list = byParent.get(pull[pulls.parentKey]) ?? [];
    list.push(pull);
    byParent.set(pull[pulls.parentKey], list);
  }
  return parents.results.map((row) => ({
    ...toJson(config, row),
    [pulls.jsonKey]: byParent.get(row['id']) ?? [],
  }));
}

async function getById(env: Env, config: ResourceConfig, id: number): Promise<Row> {
  const row = await env.DB.prepare(`SELECT * FROM ${config.table} WHERE id = ?`).bind(id).first<Row>();
  if (!row) throw new HttpError(404, 'Nicht gefunden');
  return toJson(config, row);
}

async function insert(env: Env, config: ResourceConfig, body: Row): Promise<Row[]> {
  const values = pick(body, config.fields, config.booleanFields);
  const columns = Object.keys(values);
  if (columns.length === 0) throw new HttpError(400, 'Keine gültigen Felder');
  const {results} = await run(
    env.DB.prepare(
      `INSERT INTO ${config.table} (${columns.join(', ')})
       VALUES (${columns.map(() => '?').join(', ')}) RETURNING *`,
    ).bind(...Object.values(values)),
  );
  return results.map((row) => toJson(config, row));
}

async function update(env: Env, config: ResourceConfig, id: number, body: Row): Promise<Row[]> {
  const values = pick(body, config.fields, config.booleanFields);
  const columns = Object.keys(values);
  if (columns.length === 0) throw new HttpError(400, 'Keine gültigen Felder');
  const {results} = await run(
    env.DB.prepare(
      `UPDATE ${config.table} SET ${columns.map((c) => `${c} = ?`).join(', ')}
       WHERE id = ? RETURNING *`,
    ).bind(...Object.values(values), id),
  );
  return results.map((row) => toJson(config, row));
}

async function remove(env: Env, config: ResourceConfig, id: number): Promise<Row[]> {
  const {results} = await env.DB.prepare(`DELETE FROM ${config.table} WHERE id = ? RETURNING *`)
    .bind(id)
    .all<Row>();
  return results.map((row) => toJson(config, row));
}

async function listPulls(env: Env, config: ResourceConfig, parentId: number): Promise<Row[]> {
  const {pulls} = config;
  const {results} = await env.DB.prepare(
    `SELECT * FROM ${pulls.table} WHERE ${pulls.parentKey} = ? ORDER BY created_at DESC`,
  )
    .bind(parentId)
    .all<Row>();
  return results;
}

async function insertPull(
  env: Env,
  config: ResourceConfig,
  parentId: number,
  body: Row,
): Promise<Row[]> {
  const {pulls} = config;
  const values = {...pick(body, pulls.fields, []), [pulls.parentKey]: parentId};
  const columns = Object.keys(values);
  const {results} = await run(
    env.DB.prepare(
      `INSERT INTO ${pulls.table} (${columns.join(', ')})
       VALUES (${columns.map(() => '?').join(', ')}) RETURNING *`,
    ).bind(...Object.values(values)),
  );
  return results;
}

/** Übernimmt nur erlaubte Spalten mit skalaren Werten; Booleans werden zu 0/1. */
function pick(body: Row, fields: string[], booleanFields: string[]): Row {
  const values: Row = {};
  for (const field of fields) {
    if (!(field in body)) continue;
    const value = body[field];
    if (value !== null && !['string', 'number', 'boolean'].includes(typeof value)) {
      throw new HttpError(400, `Ungültiger Wert für ${field}`);
    }
    values[field] = booleanFields.includes(field) || typeof value === 'boolean' ? (value ? 1 : 0) : value;
  }
  return values;
}

function toJson(config: ResourceConfig, row: Row): Row {
  const result = {...row};
  for (const field of config.booleanFields) result[field] = row[field] === 1;
  return result;
}

/** Führt ein Statement aus und übersetzt Constraint-Verletzungen (NOT NULL, FK, CHECK) in 400. */
async function run(statement: D1PreparedStatement): Promise<D1Result<Row>> {
  try {
    return await statement.all<Row>();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('constraint failed')) throw new HttpError(400, message);
    throw error;
  }
}
