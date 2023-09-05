import { writable } from 'svelte/store';
import type { Relative } from '$lib/types/types';
import type { Database } from '$lib/supabase/databaseDefinitions';
import type { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

export type SupabaseClientT = ReturnType<typeof createSupabaseLoadClient<Database>>;

type StoreType = {
	relatives: Relative[];
	selectedRelativeId?: string;
	supabaseClient?: SupabaseClientT;
	session: Session | null;
	errorMessage: string;
	showErrorToaster: boolean;
};

export const store = writable<StoreType>({
	relatives: [],
	session: null,
	errorMessage: '',
	showErrorToaster: false
});

let showErrorMessageTimeout: NodeJS.Timeout;
export function setErrorMessage(message: string) {
	clearTimeout(showErrorMessageTimeout);
	store.update((prev) => ({ ...prev, errorMessage: message, showErrorToaster: true }));
	showErrorMessageTimeout = setTimeout(
		() => store.update((prev) => ({ ...prev, showErrorToaster: false })),
		2000
	);
}
