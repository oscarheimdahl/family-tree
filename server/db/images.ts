import 'jsr:@std/dotenv/load';

import { createClient } from 'npm:@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_KEY')!
);

const relativesBucket = supabase.storage.from('relatives');

export async function uploadRelativeImage(image: File) {
  const res = await relativesBucket.upload('img', image);

  if (res.error) throw new Error(res.error.message);

  return res.data.id;
}
