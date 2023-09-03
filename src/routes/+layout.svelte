<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { store } from '$lib/store';

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

<h1
	class="absolute z-10 left-1/2 rounded-b-lg -translate-x-1/2 text-center text-xl text-white py-2 px-4 bg-primary-light"
>
	Pettersson Family Tree
</h1>
<slot />
