import { connectionsHandlers } from './routes/connectionsHandlers.ts';

import { relativesHandlers } from './routes/relativesHandlers.ts';

export type Context = {
  req: Request;
  responseHeaders: Headers;
};

function setOrigin(origin: string | null) {
  const allowedOrigins = [
    'http://localhost:4333',
    'https://pettersson.vercel.app',
  ];
  if (!origin) return '';
  if (allowedOrigins.includes(origin)) return origin;
  return '';
}

Deno.serve({ port: 4334 }, async (req): Promise<Response> => {
  const url = new URL(req.url);

  const path = url.pathname.split('/');

  const ctx = {
    req,
    responseHeaders: new Headers({
      'Access-Control-Allow-Origin': setOrigin(req.headers.get('Origin')),
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
    }),
  };
  //allow preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: ctx.responseHeaders,
    });
  }

  if (path.at(1) === 'api') {
    if (path.at(2) === 'relatives') return await relativesHandlers(ctx);
    if (path.at(2) === 'connections') return await connectionsHandlers(ctx);
  }

  return new Response('Not found', {
    status: 404,
    headers: ctx.responseHeaders,
  });
});

export async function c<T>(
  promise: Promise<T>
  // deno-lint-ignore no-explicit-any
): Promise<[null, T] | [any, null]> {
  try {
    const data = await promise;
    return [null, data] as [null, T];
  } catch (err) {
    // deno-lint-ignore no-explicit-any
    return [err, null] as [any, null];
  }
}
