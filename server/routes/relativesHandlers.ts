import { addRelative, deleteAllRelatives, getRelatives } from '../db/index.ts';
import { c } from '../index.ts';

export async function relativesHandlers(req: Request) {
  if (req.method === 'GET') return await getRelativesHandler();
  if (req.method === 'POST') return await postRelativeHandler(req);
  if (req.method === 'DELETE') return await deleteAllRelativesHandler(req);

  return new Response('Not found', { status: 404 });
}

async function getRelativesHandler() {
  const [dbErr, relatives] = await c(getRelatives());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error getting relatives', { status: 500 });
  }
  return new Response(JSON.stringify(relatives));
}

async function postRelativeHandler(req: Request) {
  const [err, relativeData] = await c(req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', { status: 400 });
  }

  const [dbErr] = await c(addRelative(relativeData));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error adding relative', { status: 500 });
  }
  return new Response(null, { status: 204 });
}

async function deleteAllRelativesHandler(_req: Request) {
  const [dbErr] = await c(deleteAllRelatives());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error deleting relatives', { status: 500 });
  }
  return new Response(null, { status: 204 });
}
