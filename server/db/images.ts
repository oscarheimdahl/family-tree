import 'jsr:@std/dotenv/load';

import { createClient } from 'npm:@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_KEY')!
);

const relativesBucket = supabase.storage.from('relatives');

export async function uploadRelativeImage(
  image: ReadableStream<Uint8Array>,
  mediaType: string,
  relativeId: string
) {
  const res = await relativesBucket.upload(
    `${relativeId}/profile.${mediaType}`,
    image,
    {
      upsert: true,
      contentType: `image/${mediaType}`,
    }
  );

  if (res.error) throw new Error(res.error.message);

  const urlResponse = relativesBucket.getPublicUrl(res.data.path);

  return urlResponse.data.publicUrl;
}
