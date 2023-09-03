import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from '$lib/supabase/databaseDefinitions';

// See https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
