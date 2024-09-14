import {
  addConnection,
  connectionSchema,
  deleteAllConnections,
  getConnections,
} from '../db/index.ts';
import { c } from '../index.ts';

export async function connectionsHandlers(req: Request) {
  if (req.method === 'GET') return await getConnectionsHandler();
  if (req.method === 'POST') return await postConnectionHandler(req);
  if (req.method === 'DELETE') return await deleteAllConnectionsHandler(req);

  return new Response('Not found', { status: 404 });
}

async function getConnectionsHandler() {
  const [dbErr, connections] = await c(getConnections());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error getting connections', { status: 500 });
  }
  return new Response(JSON.stringify(connections));
}

async function postConnectionHandler(req: Request) {
  const [err, connectionsData] = await c(req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', { status: 400 });
  }

  const parseRes = connectionSchema.safeParse(connectionsData);
  if (!parseRes.success) {
    return new Response(`Bad shape of connection, ${parseRes.error.message}`, {
      status: 400,
    });
  }

  const [dbErr] = await c(addConnection(parseRes.data));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error adding connection', { status: 500 });
  }
  return new Response(null, { status: 204 });
}

async function deleteAllConnectionsHandler(_req: Request) {
  const [dbErr] = await c(deleteAllConnections());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error deleting connections', { status: 500 });
  }
  return new Response(null, { status: 204 });
}
