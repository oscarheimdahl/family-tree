import { getConnections } from '../db/index.ts';
import { c, Context } from '../index.ts';

export async function imagesHandlers(ctx: Context) {
  const url = new URL(ctx.req.url);
  const path = url.pathname.split('/');
  const id = path.at(3);
  if (id) {
    if (ctx.req.method === 'GET') return await getImageHandler(ctx, id);
  }
  if (ctx.req.method === 'POST') return await postImageHandler(ctx);

  return new Response('Not found', {
    status: 404,
    headers: ctx.responseHeaders,
  });
}

async function getImageHandler(ctx: Context, id: string) {
  return new Response('Not found', {
    status: 404,
    headers: ctx.responseHeaders,
  });
  const [dbErr, connections] = await c(getConnections());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error getting connections', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(JSON.stringify(connections));
}

async function postImageHandler(ctx: Context) {
  return new Response('Not found', {
    status: 404,
    headers: ctx.responseHeaders,
  });
  const [err, connectionsData] = await c(ctx.req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }
}
