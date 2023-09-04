<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Gear from '$lib/icons/GearIcon.svelte';
	import { store, type SupabaseClientT } from '$lib/store';
	import type { Session } from '@supabase/supabase-js';
	export let handleHidePartnerClick: () => void;

	let supabase: SupabaseClientT;
	let session: Session | null;
	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
		session = val.session;
	});

	async function handleLoginClick() {
		const res = await supabase.auth.signInWithPassword({
			email: 'o.heimdahl@gmail.com',
			password: 'password'
		});
		console.log(res);
	}
	async function handleLogoutClick() {
		const res = await supabase.auth.signOut();
		store.update((prev) => ({ ...prev, session: null }));
	}
</script>

<div
	class="text-white absolute top-0 left-2 w-60 bg-primary-light flex flex-col items-center rounded-b-xl p-2 gap-2 -translate-y-full hover:translate-y-0 transition-transform [&:has(button:focus)]:translate-y-0"
>
	{#if session}
		{session.user.email}
		<Button onClick={handleLogoutClick}>Logout</Button>
	{:else}
		<Button onClick={handleLoginClick}>Login</Button>
	{/if}
	<div class="w-[calc(100%-4rem)] my-2 h-[2px] bg-accent-1" />
	<button
		on:click={handleHidePartnerClick}
		class=" shadow-md p-2 bg-primary-dark rounded-md hover:scale-95 active:scale-90"
		>Hide partners</button
	>
	<div
		class="absolute flex justify-center items-center -bottom-9 left-4 w-12 h-9 rounded-b-lg bg-primary-light"
	>
		<Gear />
	</div>
</div>
