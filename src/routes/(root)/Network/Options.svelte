<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Gear from '$lib/icons/GearIcon.svelte';
	import { setErrorMessage, store, type SupabaseClientT } from '$lib/store';
	import type { Session } from '@supabase/supabase-js';
	export let handleHidePartnerClick: () => void;

	let supabase: SupabaseClientT;
	let session: Session | null;
	let email = '';
	let password = '';

	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
		session = val.session;
	});

	async function handleLoginClick() {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) setErrorMessage(error.message);
	}

	async function handleLogoutClick() {
		const res = await supabase.auth.signOut();
		store.update((prev) => ({ ...prev, session: null }));
	}
</script>

<div
	class="text-white absolute top-0 left-2 bg-primary-light flex flex-col items-center rounded-b-xl p-4 gap-2 -translate-y-full hover:translate-y-0 transition-transform [&:has(button:focus)]:translate-y-0"
>
	{#if session}
		{session.user.email}
		<Button onClick={handleLogoutClick}>Logout</Button>
	{:else}
		<form class="flex flex-col gap-2 items-center">
			<input bind:value={email} placeholder="Email" type="text" class="text-black" />
			<input bind:value={password} placeholder="Password" type="password" class="text-black" />
			<Button onClick={handleLoginClick}>Login</Button>
		</form>
	{/if}
	<div class="w-[calc(100%-4rem)] my-2 h-[2px] bg-accent-1" />
	<Button onClick={handleHidePartnerClick}>Hide partners</Button>
	<div
		class="absolute flex justify-center items-center -bottom-9 left-4 w-12 h-9 rounded-b-lg bg-primary-light"
	>
		<Gear />
	</div>
</div>
