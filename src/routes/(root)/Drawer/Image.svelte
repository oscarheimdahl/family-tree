<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import EditStopIcon from '$lib/icons/EditStopIcon.svelte';
	import { store, type SupabaseClientT } from '$lib/store';
	import type { Relative } from '$lib/types/types';
	import type { Session } from '@supabase/supabase-js';
	import { capitalizeFirstLetter } from '../Network/helpers/formatFullName';
	import { onMount } from 'svelte';
	import UserIcon from '$lib/icons/UserIcon.svelte';
	import UploadIcon from '$lib/icons/UploadIcon.svelte';

	export let editing: boolean;
	export let selectedRelative: Relative;
	let supabase: SupabaseClientT;
	let imgElement: HTMLImageElement;
	let fileInput: HTMLInputElement;

	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
	});

	async function handleUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.item(0);
		if (!file) return;
		const path = `img/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
		const res = await supabase.storage
			.from('relatives')
			.upload(path, file, { contentType: file.type, upsert: true });
		if (res.error) return;
		const data = supabase.storage.from('relatives').getPublicUrl(path);
		const url = data.data.publicUrl;
		await supabase.from('relatives').update({ image: url }).eq('id', selectedRelative.id);
		imgElement.src = url;
	}
</script>

<button
	disabled={!editing}
	class="group relative m-4 rounded-md overflow-hidden w-72 aspect-square"
	aria-label="upload-image"
	on:click={() => {
		if (!editing) return;
		fileInput.click();
	}}
>
	{#if selectedRelative.image}
		<img
			bind:this={imgElement}
			class="w-full h-full object-cover object-center bg-primary-dark"
			class:animate-ping={!imgElement?.loading}
			src={selectedRelative?.image ??
				'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
			alt={`picture of ${selectedRelative?.firstname}`}
		/>
	{:else}
		<div class="rounded-md w-72 h-72 bg-primary-dark grid place-content-center">
			<span class="scale-[600%]">
				<UserIcon />
			</span>
		</div>
	{/if}
	{#if editing}
		<div
			class:opacity-90={selectedRelative.image}
			class="absolute top-0 left-0 rounded-md w-72 h-72 bg-primary-dark grid place-content-center"
		>
			<span
				class="scale-[600%] transition-transform
                   group-hover:scale-[570%]
                   group-active:translate-y-2"
			>
				<UploadIcon />
			</span>
		</div>
	{/if}
</button>

<input
	bind:this={fileInput}
	class="hidden"
	on:change={handleUpload}
	type="file"
	id="file-selector"
	accept=".jpg, .jpeg, .png"
/>
