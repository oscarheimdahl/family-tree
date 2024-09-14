import { connectionsHandlers } from './routes/connectionsHandlers.ts';
import { relativesHandlers } from './routes/relativesHandlers.ts';

export type Context = {
  req: Request;
  responseHeaders: Headers;
};

Deno.serve(async (req): Promise<Response> => {
  const url = new URL(req.url);

  const path = url.pathname.split('/');

  const ctx = {
    req,
    responseHeaders: new Headers({
      'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
    }),
  };

  if (path.at(1) === 'api') {
    if (path.at(2) === 'relatives') return await relativesHandlers(ctx);
    if (path.at(2) === 'connections') return await connectionsHandlers(ctx);
  }

  return new Response('Not found', { status: 404 });
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
