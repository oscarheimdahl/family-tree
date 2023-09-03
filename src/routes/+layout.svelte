<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { supabaseStore } from '$lib/store/supabaseStore';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		supabaseStore.set(supabase);
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<slot />
