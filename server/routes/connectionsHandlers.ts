import {
  addConnection,
  connectionSchema,
  deleteAllConnections,
  getConnections,
} from '../db/index.ts';
import { c, Context } from '../index.ts';

export async function connectionsHandlers(ctx: Context) {
  if (ctx.req.method === 'GET') return await getConnectionsHandler(ctx);
  if (ctx.req.method === 'POST') return await postConnectionHandler(ctx);
  if (ctx.req.method === 'DELETE')
    return await deleteAllConnectionsHandler(ctx);

  return new Response('Not found', { status: 404 });
}

async function getConnectionsHandler(ctx: Context) {
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

async function postConnectionHandler(ctx: Context) {
  const [err, connectionsData] = await c(ctx.req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const parseRes = connectionSchema.safeParse(connectionsData);
  if (!parseRes.success) {
    return new Response(`Bad shape of connection, ${parseRes.error.message}`, {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const [dbErr] = await c(addConnection(parseRes.data));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error adding connection', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}

async function deleteAllConnectionsHandler(ctx: Context) {
  const [dbErr] = await c(deleteAllConnections());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error deleting connections', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}
