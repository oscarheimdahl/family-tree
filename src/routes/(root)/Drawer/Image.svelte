<script lang="ts">
	import ProgessIcon from '$lib/icons/ProgessIcon.svelte';
	import UploadIcon from '$lib/icons/UploadIcon.svelte';
	import UserIcon from '$lib/icons/UserIcon.svelte';
	import { setErrorMessage, store, type SupabaseClientT } from '$lib/store';
	import type { Relative } from '$lib/types/types';

	export let editing: boolean;
	export let selectedRelative: Relative;
	let supabase: SupabaseClientT;
	let imgElement: HTMLImageElement;
	let fileInput: HTMLInputElement;

	let loading = false;

	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
	});

	async function handleUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.item(0);
		if (!file) return;
		loading = true;
		const path = `img/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
		const { error } = await supabase.storage
			.from('relatives')
			.upload(path, file, { contentType: file.type, upsert: true });
		if (error) {
			loading = false;
			setErrorMessage(error.message);
			return;
		}
		const { data } = supabase.storage.from('relatives').getPublicUrl(path);
		const url = data.publicUrl;
		const { error: updateError } = await supabase
			.from('relatives')
			.update({ image: url })
			.eq('id', selectedRelative.id);
		if (updateError) {
			loading = false;
			setErrorMessage(updateError.message);
			return;
		}
		selectedRelative.image = url;
		// const fr = new FileReader();
		// fr.onload = function () {
		// 	if (!imgElement || typeof fr.result !== 'string') return;
		// 	imgElement.src = fr.result;
		// 	selectedRelative.image = 'hej';
		// };
		// fr.readAsDataURL(file);
		loading = false;
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
	<img
		class:hidden={!selectedRelative.image}
		bind:this={imgElement}
		class="w-full h-full object-cover object-center bg-primary-dark"
		src={selectedRelative.image}
		alt={`picture of ${selectedRelative?.firstname}`}
	/>
	<div
		class:hidden={selectedRelative.image}
		class="rounded-md w-72 h-72 bg-primary-dark grid place-content-center"
	>
		<span class="scale-[600%]">
			<UserIcon />
		</span>
	</div>
	{#if editing}
		<div
			class:opacity-90={selectedRelative.image}
			class="absolute top-0 left-0 rounded-md w-72 h-72 bg-primary-dark grid place-content-center"
		>
			<span
				class="scale-[600%] transition-transform
                   group-hover:scale-[570%]
                   group-active:translate-y-2"
				>{#if loading}
					<div class="animate-spin w-min h-min">
						<ProgessIcon />
					</div>
				{:else}
					<UploadIcon />
				{/if}
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
	accept=".jpg, .jpeg, .png, .pdf"
/>
