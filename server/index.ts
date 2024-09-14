import { connectionsHandlers } from './routes/connectionsHandlers.ts';
import { relativesHandlers } from './routes/relativesHandlers.ts';

Deno.serve(async (req) => {
  const url = new URL(req.url);

  const path = url.pathname.split('/');

  if (path.at(1) === 'api') {
    if (path.at(2) === 'relatives') return relativesHandlers(req);
    if (path.at(2) === 'connections') return connectionsHandlers(req);
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
