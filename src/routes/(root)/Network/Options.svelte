<script lang="ts">
	import Gear from '$lib/icons/GearIcon.svelte';
	import { supabaseStore, type SupabaseType } from '$lib/store/supabaseStore';
	export let handleHidePartnerClick: () => void;

	let supabase: SupabaseType;
	supabaseStore.subscribe((val) => (supabase = val));

	async function handleLoginClick() {
		const res = await supabase.auth.signInWithPassword({
			email: 'o.heimdahl@gmail.com',
			password: 'password'
		});
		console.log(res);
	}
	async function handleLogoutClick() {
		const res = await supabase.auth.signOut();
		console.log(res);
	}
</script>

<div
	class="text-white absolute top-0 left-2 bg-primary-light flex flex-col rounded-b-xl p-2 gap-2 -translate-y-full hover:translate-y-0 transition-transform [&:has(button:focus)]:translate-y-0"
>
	<button
		on:click={handleLogoutClick}
		class=" shadow-md p-2 bg-primary-dark rounded-md hover:scale-95 active:scale-90">Logout</button
	>
	<button
		on:click={handleLoginClick}
		class=" shadow-md p-2 bg-primary-dark rounded-md hover:scale-95 active:scale-90">Login</button
	>
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
