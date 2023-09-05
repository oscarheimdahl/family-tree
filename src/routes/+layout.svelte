<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { store } from '$lib/store';
	import Toaster from '$lib/components/Toaster.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		store.update((prev) => ({ ...prev, supabaseClient: supabase, session }));
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			store.update((prev) => ({ ...prev, supabaseClient: supabase, session: _session }));
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<slot />
<Toaster />
