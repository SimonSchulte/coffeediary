import {authenticate, loginWithGoogle, logout} from './auth';
import {Env} from './env';
import {HttpError, json} from './http';
import {handleResource, RESOURCES} from './resources';

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') {
      return new Response(null, {status: cors ? 204 : 403, headers: cors ?? {}});
    }

    let response: Response;
    try {
      response = await handleApi(request, env, url.pathname);
    } catch (error) {
      if (error instanceof HttpError) {
        response = json({error: error.message}, {status: error.status});
      } else {
        console.error(error);
        response = json({error: 'Interner Fehler'}, {status: 500});
      }
    }

    if (cors) {
      response = new Response(response.body, response);
      for (const [key, value] of Object.entries(cors)) response.headers.set(key, value);
    }
    return response;
  },
} satisfies ExportedHandler<Env>;

async function handleApi(request: Request, env: Env, pathname: string): Promise<Response> {
  const segments = pathname.split('/').filter(Boolean).slice(1); // ohne "api"

  if (segments[0] === 'auth') {
    if (segments[1] === 'config' && request.method === 'GET') {
      return json({googleClientId: env.GOOGLE_CLIENT_ID});
    }
    if (request.method !== 'POST') throw new HttpError(405, 'Methode nicht erlaubt');
    if (segments[1] === 'google') return loginWithGoogle(request, env);
    if (segments[1] === 'logout') return logout();
    throw new HttpError(404, 'Nicht gefunden');
  }

  const user = await authenticate(request, env);

  if (segments[0] === 'me' && segments.length === 1) {
    return json(user);
  }

  const [resource, rawId, sub, ...rest] = segments;
  const config = resource ? RESOURCES[resource] : undefined;
  if (!config || rest.length > 0) throw new HttpError(404, 'Nicht gefunden');

  let id: number | null = null;
  if (rawId !== undefined) {
    id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Ungültige ID');
  }
  return handleResource(request, env, config, id, sub);
}

/** CORS nur für explizit erlaubte Origins (z. B. die Capacitor-App); same-origin braucht keine Header. */
function corsHeaders(request: Request, env: Env): Record<string, string> | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  if (!allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}
