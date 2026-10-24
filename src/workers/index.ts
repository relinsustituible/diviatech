import { Router } from 'itty-router';

interface Env {
  ENVIRONMENT: string;
  DB: D1Database;
  SESSIONS: KVNamespace;
  CACHE: KVNamespace;
  AI: any;
  JWT_SECRET: string;
  STREAM_ACCOUNT_ID: string;
  STREAM_API_TOKEN: string;
  ALLOWED_ORIGINS: string;
  NEXT_PUBLIC_API_URL?: string;
}

const router = Router();

const defaultHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Origin': origin ?? '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
});

const allowOrigin = (req: Request, env: Env) => {
  const origin = req.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  if (!origin) return '*';
  if (allowed.includes(origin)) return origin;
  return allowed[0] ?? '*';
};

router.options('*', (req: Request, env: Env) => {
  return new Response(null, {
    status: 204,
    headers: defaultHeaders(allowOrigin(req, env)),
  });
});

router.get('/api/health', (req: Request, env: Env) => {
  return new Response(JSON.stringify({ status: 'ok', environment: env.ENVIRONMENT || 'production' }), {
    headers: defaultHeaders(allowOrigin(req, env)),
  });
});

router.post('/api/auth/login', async (req: Request, env: Env) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y password son requeridos.' }), {
        status: 400,
        headers: defaultHeaders(allowOrigin(req, env)),
      });
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado.' }), {
        status: 401,
        headers: defaultHeaders(allowOrigin(req, env)),
      });
    }

    const token = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.user_type }));

    return new Response(JSON.stringify({
      token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      },
    }), {
      status: 200,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  }
});

router.get('/api/consultations', async (req: Request, env: Env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM consultations ORDER BY created_at DESC LIMIT 50').all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  }
});

router.post('/api/consultations', async (req: Request, env: Env) => {
  try {
    const { patient_id, professional_id, consultation_type, scheduled_at } = await req.json();
    const id = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO consultations (id, patient_id, professional_id, consultation_type, status, scheduled_at)
      VALUES (?, ?, ?, ?, 'waiting', ?)
    `).bind(id, patient_id, professional_id, consultation_type, scheduled_at).run();

    return new Response(JSON.stringify({ id, status: 'created' }), {
      status: 201,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 400,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  }
});

router.post('/api/stream/create-live-input', async (req: Request, env: Env) => {
  try {
    const { consultation_id } = await req.json();

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.STREAM_ACCOUNT_ID}/live_inputs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STREAM_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: { name: `consultation-${consultation_id}` },
        recording: {
          mode: 'automatic',
          timeoutSeconds: 0,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return new Response(JSON.stringify(data.result), {
      status: 201,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  }
});

router.post('/api/ai/triage', async (req: Request, env: Env) => {
  try {
    const { symptoms, history } = await req.json();

    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente clínico. Responde de forma breve, práctica y segura.',
        },
        {
          role: 'user',
          content: `Síntomas: ${symptoms}. Historia: ${history}`,
        },
      ],
    });

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: defaultHeaders(allowOrigin(req, env)),
    });
  }
});

router.all('*', (req: Request, env: Env) => {
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: defaultHeaders(allowOrigin(req, env)),
  });
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env);
  },
};
