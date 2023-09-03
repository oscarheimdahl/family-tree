<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import EditStopIcon from '$lib/icons/EditStopIcon.svelte';
	import { store, type SupabaseClientT } from '$lib/store';
	import type { Relative } from '$lib/types/types';
	import type { Session } from '@supabase/supabase-js';
	import { capitalizeFirstLetter } from '../Network/helpers/formatFullName';
	import Image from './Image.svelte';

	let supabase: SupabaseClientT;
	let selectedRelative: Relative | undefined;
	let relatives: Relative[] | undefined;
	let session: Session | null;

	let editing = false;
	let firstnameInput: string;
	let lastnameInput: string;
	let descriptionInput: string;

	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
		session = val.session;
		relatives = val.relatives;

		let foundRelative = relatives?.find((relative) => relative.id === val.selectedRelativeId);
		if (foundRelative) {
			firstnameInput = capitalizeFirstLetter(foundRelative.firstname);
			lastnameInput = capitalizeFirstLetter(foundRelative.lastname);
			descriptionInput = foundRelative?.description ?? '';
		}
		selectedRelative = foundRelative;
	});

	let sendToSupabaseTimeout: NodeJS.Timeout;
	function updateRelativeDebounce(relativeData: Partial<Relative>) {
		clearTimeout(sendToSupabaseTimeout);
		sendToSupabaseTimeout = setTimeout(async () => {
			if (!selectedRelative) return;
			await supabase
				.from('relatives')
				.update({ ...relativeData })
				.eq('id', selectedRelative.id);
		}, 500);
	}

	async function handleFirstnameInput() {
		updateRelativeDebounce({ firstname: firstnameInput });
	}

	async function handleLastnameInput() {
		updateRelativeDebounce({ lastname: lastnameInput });
	}

	let sendDescriptionInputTimout: NodeJS.Timeout;
	async function handleDescriptionInput(
		e: Event & { currentTarget: EventTarget & HTMLSpanElement }
	) {
		const target = e.target as HTMLSpanElement;
		clearTimeout(sendDescriptionInputTimout);
		sendDescriptionInputTimout = setTimeout(() => {
			if (!selectedRelative) return;
			supabase
				.from('relatives')
				.update({ description: target.textContent })
				.eq('id', selectedRelative.id)
				.then((res) => console.log(res));
		}, 500);
	}
</script>

<div
	aria-hidden={!selectedRelative}
	class:translate-x-full={!selectedRelative}
	class="absolute z-10 h-[calc(100%-2rem)] my-4 max-w-lg p-4 right-0 text-white bg-primary-light shadow-2xl shadow-gray-900 transition-transform rounded-l-md"
>
	{#if selectedRelative}
		<div class="flex flex-col justify-between h-full">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					{#if editing}
						<!-- <div class="flex gap-2"> -->
						<input
							type="text"
							class="text-xl font-semibold text-black bg-none rounded-sm px-2 -translate-x-2"
							size={firstnameInput.length}
							bind:value={firstnameInput}
							on:input={handleFirstnameInput}
						/>
						<input
							type="text"
							class="text-xl font-semibold text-black bg-none rounded-sm px-2 -translate-x-2"
							size={lastnameInput.length}
							bind:value={lastnameInput}
							on:input={handleLastnameInput}
						/>
						<!-- </div> -->
					{:else}
						<h1 class="text-xl font-semibold">
							{firstnameInput}{' '}
							{lastnameInput}
						</h1>
					{/if}
				</div>
				<Image {editing} {selectedRelative} />
				<div class="ml-2">
					<h3 class="-ml-2 font-bold text-lg">Born</h3>
					<p class="">{selectedRelative.birthyear}</p>
				</div>
				<div class="ml-2">
					<h3 class="-ml-2 font-bold text-lg">About</h3>
					{#if editing}
						<span
							class="bg-white text-black whitespace-pre-wrap"
							contenteditable="true"
							on:input={handleDescriptionInput}>{descriptionInput}</span
						>
					{:else}
						<span class="resize-none h-fit">{descriptionInput}</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-col justify-center gap-4 w-full">
				<div class="mx-8 h-[2px] bg-primary-dark max-w-full" />
				<div class="flex justify-center">
					<Button disabled={!session} onClick={() => (editing = !editing)}>
						{#if editing}
							<EditStopIcon /> Stop Editing
						{:else}
							<EditIcon /> Edit
						{/if}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
