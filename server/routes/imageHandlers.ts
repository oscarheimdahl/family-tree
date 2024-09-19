import { uploadRelativeImage } from '../db/images.ts';
import { getConnections, updateRelative } from '../db/index.ts';
import { c, Context } from '../index.ts';
import {
  MultipartParseError,
  parseMultipartRequest,
} from 'jsr:@mjackson/multipart-parser@^0.6.2';

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

export async function updateRelativeImageHandler(ctx: Context) {
  const url = new URL(ctx.req.url);
  const path = url.pathname.split('/');
  const relativeId = path.at(3)!;
  try {
    const firstIter = await parseMultipartRequest(ctx.req).next();
    if (firstIter.done) throw new Error('No parts found in parse');

    const part = firstIter.value;
    const mediaType = part.mediaType?.split('/').at(1);

    if (mediaType !== 'jpeg' && mediaType !== 'png')
      return new Response('Invalid media type', {
        status: 400,
        headers: ctx.responseHeaders,
      });

    const imageUrl = await uploadRelativeImage(
      part.body,
      mediaType,
      relativeId
    );

    await updateRelative({ id: relativeId, imageUrl: imageUrl });

    return new Response(JSON.stringify({ imageUrl: imageUrl }), {
      status: 201,
      headers: ctx.responseHeaders,
    });
  } catch (error) {
    if (error instanceof MultipartParseError) {
      console.error('Failed to parse multipart request:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
  return new Response('not OK', {
    status: 500,
    headers: ctx.responseHeaders,
  });
}
