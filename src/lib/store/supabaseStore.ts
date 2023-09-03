import type { Database } from '$lib/supabase/databaseDefinitions';
import type { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { writable } from 'svelte/store';

export type SupabaseType = ReturnType<typeof createSupabaseLoadClient<Database>>;
export const supabaseStore = writable<SupabaseType>();
