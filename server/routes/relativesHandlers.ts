import {
  addRelative,
  deleteAllRelatives,
  getRelatives,
  relativeSchema,
} from '../db/index.ts';
import { c } from '../index.ts';

import { Context } from '../index.ts';

export async function relativesHandlers(ctx: Context) {
  if (ctx.req.method === 'GET') return await getRelativesHandler(ctx);
  if (ctx.req.method === 'POST') return await postRelativeHandler(ctx);
  if (ctx.req.method === 'DELETE') return await deleteAllRelativesHandler(ctx);

  return new Response('Not found', {
    status: 404,
    headers: ctx.responseHeaders,
  });
}

async function getRelativesHandler(ctx: Context) {
  const [dbErr, relatives] = await c(getRelatives());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error getting relatives', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(JSON.stringify(relatives));
}

async function postRelativeHandler(ctx: Context) {
  const [err, relativeData] = await c(ctx.req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const parseRes = relativeSchema.safeParse(relativeData);
  if (!parseRes.success) {
    return new Response(`Bad shape of relative, ${parseRes.error.message}`, {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const [dbErr] = await c(addRelative(relativeData));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error adding relative', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}

async function deleteAllRelativesHandler(ctx: Context) {
  const [dbErr] = await c(deleteAllRelatives());
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error deleting relatives', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204 });
}
