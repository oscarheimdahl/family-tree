import {
  addRelative,
  deleteAllRelatives,
  deleteRelative,
  getRelatives,
  relativeSchema,
  updateRelative,
} from '../db/index.ts';
import { c } from '../index.ts';

import { Context } from '../index.ts';

export async function relativesHandlers(ctx: Context) {
  const url = new URL(ctx.req.url);
  const path = url.pathname.split('/');
  const route = path.at(3);
  if (route === 'image') {
    if (ctx.req.method === 'PUT') return await updateRelativeImageHandler(ctx);
  }
  if (route) {
    if (ctx.req.method === 'DELETE')
      return await deleteRelativeHandler(ctx, route);
  }
  if (ctx.req.method === 'GET') return await getRelativesHandler(ctx);
  if (ctx.req.method === 'POST') return await postRelativeHandler(ctx);
  if (ctx.req.method === 'DELETE') return await deleteAllRelativesHandler(ctx);
  if (ctx.req.method === 'PUT') return await updateRelativeHandler(ctx);

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
  return new Response(JSON.stringify(relatives), {
    headers: ctx.responseHeaders,
  });
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
    console.log(parseRes.error);
    return new Response(`Bad shape of relative, ${parseRes.error.message}`, {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const [dbErr] = await c(addRelative(parseRes.data));
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
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}

async function deleteRelativeHandler(ctx: Context, id: string) {
  const [dbErr] = await c(deleteRelative(id));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error deleting relatives', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}

async function updateRelativeHandler(ctx: Context) {
  const [err, relativeData] = await c(ctx.req.json());
  if (err) {
    console.log(err);
    return new Response('Invalid JSON', {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const parseRes = relativeSchema.partial().safeParse(relativeData);
  if (!parseRes.success) {
    console.log(parseRes.error);
    return new Response(`Bad shape of relative, ${parseRes.error.message}`, {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }

  const [dbErr] = await c(updateRelative(parseRes.data));
  if (dbErr) {
    console.log(dbErr);
    return new Response('Error updating relative', {
      status: 500,
      headers: ctx.responseHeaders,
    });
  }
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}

async function updateRelativeImageHandler(ctx: Context) {
  const contentType = ctx.req.headers.get('content-type')!;
  const boundary = contentType.split('boundary=')[1];

  if (ctx.req.body === null) {
    return new Response('No body', {
      status: 400,
      headers: ctx.responseHeaders,
    });
  }
  // // Use MultipartReader to read the body
  // const form = new MultipartReader(ctx.req.body, boundary);
  // const formData = await form.readForm();

  // // Get the image file from the form data (assuming it's named 'image')
  // const image = formData.file('image');
  return new Response(null, { status: 204, headers: ctx.responseHeaders });
}
