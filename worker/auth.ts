import {createRemoteJWKSet, jwtVerify, SignJWT} from 'jose';
import {Env} from './env';
import {HttpError, json, readJson} from './http';

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

const SESSION_COOKIE = 'session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export interface SessionUser {
  email: string;
  name: string | null;
  picture: string | null;
}

/** Ermittelt den angemeldeten Nutzer aus Bearer-Token (App) oder Session-Cookie (Web). */
export async function authenticate(request: Request, env: Env): Promise<SessionUser> {
  if (env.DEV_USER_EMAIL) {
    return requireAllowedUser(env, env.DEV_USER_EMAIL, null);
  }

  const bearer = request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];
  const token = bearer ?? readCookie(request, SESSION_COOKIE);
  if (!token) throw new HttpError(401, 'Nicht angemeldet');

  // Cookies werden vom Browser automatisch mitgeschickt → schreibende Requests nur von der eigenen Origin.
  if (!bearer && request.method !== 'GET') {
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) {
      throw new HttpError(403, 'Fremde Origin');
    }
  }

  let payload;
  try {
    ({payload} = await jwtVerify(token, sessionKey(env), {algorithms: ['HS256']}));
  } catch {
    throw new HttpError(401, 'Session ungültig oder abgelaufen');
  }
  if (typeof payload.sub !== 'string') throw new HttpError(401, 'Session ungültig');

  const picture = typeof payload['picture'] === 'string' ? payload['picture'] : null;
  return requireAllowedUser(env, payload.sub, picture);
}

/** POST /api/auth/google – tauscht ein Google-ID-Token gegen eine eigene Session. */
export async function loginWithGoogle(request: Request, env: Env): Promise<Response> {
  const {idToken} = await readJson(request);
  if (typeof idToken !== 'string') throw new HttpError(400, 'idToken fehlt');

  let claims;
  try {
    ({payload: claims} = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: GOOGLE_ISSUERS,
      audience: env.GOOGLE_CLIENT_ID,
    }));
  } catch {
    throw new HttpError(401, 'Google-Token ungültig');
  }

  const email = typeof claims['email'] === 'string' ? claims['email'].toLowerCase() : null;
  if (!email || claims['email_verified'] !== true) {
    throw new HttpError(401, 'E-Mail-Adresse nicht bestätigt');
  }
  const picture = typeof claims['picture'] === 'string' ? claims['picture'] : null;
  const user = await requireAllowedUser(env, email, picture);

  const token = await new SignJWT({picture})
    .setProtectedHeader({alg: 'HS256'})
    .setSubject(user.email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(sessionKey(env));

  return json(
    {token, user},
    {
      headers: {
        'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`,
      },
    },
  );
}

/** POST /api/auth/logout – löscht das Session-Cookie (die App verwirft ihr Token selbst). */
export function logout(): Response {
  return new Response(null, {
    status: 204,
    headers: {'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`},
  });
}

async function requireAllowedUser(
  env: Env,
  email: string,
  picture: string | null,
): Promise<SessionUser> {
  const row = await env.DB.prepare('SELECT email, name FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<{email: string; name: string | null}>();
  if (!row) throw new HttpError(403, 'Kein Zugriff für diese E-Mail-Adresse');
  return {email: row.email, name: row.name, picture};
}

function sessionKey(env: Env): Uint8Array {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET fehlt oder ist zu kurz');
  }
  return new TextEncoder().encode(env.SESSION_SECRET);
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return null;
}
