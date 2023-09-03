<script lang="ts">
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import { relativesStore, selectedRelativeIdStore } from '$lib/store/relative';
	import type { Relative } from '$lib/types/types';
	import type { FormEventHandler } from 'svelte/elements';
	import { capitalizeFirstLetter, formatFullName } from '../Network/helpers/formatFullName';
	import { supabaseStore, type SupabaseType } from '$lib/store/supabaseStore';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import EditStopIcon from '$lib/icons/EditStopIcon.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';

	let supabase: SupabaseType;
	supabaseStore.subscribe((val) => (supabase = val));

	let selectedRelative: Relative | undefined;
	let relatives: Relative[];

	selectedRelativeIdStore.subscribe((val) => {
		let foundRelative = relatives?.find((relative) => relative.id === val);
		selectedRelative = foundRelative;
		if (selectedRelative) {
			firstnameInput = capitalizeFirstLetter(selectedRelative.firstname);
			lastnameInput = capitalizeFirstLetter(selectedRelative.lastname);
			descriptionInput = selectedRelative?.description ?? '';
		}
	});
	relativesStore.subscribe((val) => (relatives = val));

	let editing = false;
	let firstnameInput: string;
	let lastnameInput: string;
	let descriptionInput: string;

	let sendToSupabaseTimeout: NodeJS.Timeout;
	function updateRelativeDebounce(relativeData: Partial<Relative>) {
		clearTimeout(sendToSupabaseTimeout);
		sendToSupabaseTimeout = setTimeout(() => {
			if (!selectedRelative) return;
			supabase
				.from('relatives')
				.update({ ...relativeData })
				.eq('id', selectedRelative.id);
		}, 500);
	}
	let sendFirstnameInputTimout: NodeJS.Timeout;
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
	class="absolute z-10 h-[calc(100%-1rem)] w-96 mt-4 p-4 right-0 text-white bg-primary-light shadow-lg transition-transform rounded-l-md"
>
	{#if selectedRelative}
		<div class="flex flex-col justify-between h-full">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2 justify-between items-center">
					{#if editing}
						<div class="flex gap-2">
							<input
								type="text"
								class="w-1/2 text-xl font-semibold text-black bg-none"
								bind:value={firstnameInput}
								on:input={handleFirstnameInput}
							/>
							<input
								type="text"
								class=" w-1/2 text-xl font-semibold text-black bg-none"
								bind:value={lastnameInput}
								on:input={handleLastnameInput}
							/>
						</div>
					{:else}
						<h1 class="text-xl font-semibold">
							{firstnameInput}{' '}
							{lastnameInput}
						</h1>
					{/if}
				</div>
				<img
					class="rounded-md m-8"
					src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
					alt={`picture of ${selectedRelative.firstname}`}
				/>
				<h3>Description</h3>
				{#if editing}
					<span
						class="bg-white text-black whitespace-pre-wrap"
						contenteditable="true"
						on:input={handleDescriptionInput}>{descriptionInput}</span
					>
				{:else}
					<span class="text-black resize-none h-fit">{descriptionInput}</span>
				{/if}
			</div>
			<div class="flex justify-end">
				<Button onClick={() => (editing = !editing)}>
					{#if editing}
						<EditStopIcon /> Stop Editing
					{:else}
						<EditIcon /> Edit
					{/if}
				</Button>
			</div>
		</div>
	{/if}
</div>
