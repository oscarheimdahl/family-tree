import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';

export const supabase = createClient(PUBLIC_SUPABASE_URL, env.SERVICE_ROLE_SUPABASE_KEY);
