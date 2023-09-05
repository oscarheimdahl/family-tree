<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import EditStopIcon from '$lib/icons/EditStopIcon.svelte';
	import { store, type SupabaseClientT } from '$lib/store';
	import type { Relative } from '$lib/types/types';
	import type { Session } from '@supabase/supabase-js';
	import { capitalizeFirstLetter } from '../Network/helpers/formatFullName';
	import Image from './Image.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte';
	import ProgessIcon from '$lib/icons/ProgessIcon.svelte';
	import CheckIcon from '$lib/icons/CheckIcon.svelte';

	let supabase: SupabaseClientT;
	let selectedRelative: Relative | undefined;
	let relatives: Relative[] | undefined;
	let session: Session | null;

	let editing = false;
	let firstnameInput: string;
	let lastnameInput: string;
	let birthyearInput: number;
	let descriptionInput: string;
	let descriptionInputElement: HTMLTextAreaElement;

	let loadingDBWrite = false;
	let savedDBWrite = false;

	store.subscribe((val) => {
		if (val.supabaseClient) supabase = val.supabaseClient;
		session = val.session;
		relatives = val.relatives;

		let foundRelative = relatives?.find((relative) => relative.id === val.selectedRelativeId);
		if (foundRelative) {
			firstnameInput = capitalizeFirstLetter(foundRelative.firstname);
			lastnameInput = capitalizeFirstLetter(foundRelative.lastname);
			birthyearInput = foundRelative.birthyear ?? -1;
			descriptionInput = foundRelative?.description ?? '';
		}
		selectedRelative = foundRelative;
	});

	let sendToSupabaseTimeout: NodeJS.Timeout;
	function updateRelativeDebounce(relativeData: Partial<Relative>) {
		console.log(`🔴`);
		savedDBWrite = false;
		loadingDBWrite = true;
		clearTimeout(sendToSupabaseTimeout);
		sendToSupabaseTimeout = setTimeout(async () => {
			if (!selectedRelative) return;
			await supabase
				.from('relatives')
				.update({ ...relativeData })
				.eq('id', selectedRelative.id)
				.then((res) => {
					loadingDBWrite = false;
					savedDBWrite = true;
					setTimeout(() => (savedDBWrite = false), 3000);
				});
		}, 500);
	}

	async function handleFirstnameInput() {
		updateRelativeDebounce({ firstname: firstnameInput });
	}

	async function handleLastnameInput() {
		updateRelativeDebounce({ lastname: lastnameInput });
	}

	async function handleBirthYearInput() {
		updateRelativeDebounce({ birthyear: birthyearInput });
	}

	async function handleDescriptionInput(e: Event) {
		const target = e.target as HTMLInputElement;
		descriptionInput = target.value;
		updateRelativeDebounce({ description: descriptionInput });
	}
</script>

<div
	aria-hidden={!selectedRelative}
	class:translate-x-full={!selectedRelative}
	class="absolute overflow-hidden z-10 h-[calc(100%-2rem)] my-4 p-4 right-0 text-white bg-primary-light shadow-2xl shadow-gray-900 transition-transform rounded-l-md max-w-xs lg:max-w-lg"
>
	{#if selectedRelative}
		<div class="flex flex-col justify-between h-full">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2 justify-end">
					<Button
						secondary
						onClick={() => {
							store.update((prev) => ({ ...prev, selectedRelativeId: undefined }));
						}}
					>
						<CloseIcon />
					</Button>
				</div>
				<div class="mx-1 h-[2px] bg-accent-1 max-w-full" />
				{#if editing}
					<div class="flex gap-2 justify-center">
						<input
							type="text"
							class="text-2xl font-semibold text-black bg-none rounded-sm px-2 -translate-x-2"
							size={firstnameInput.length}
							bind:value={firstnameInput}
							on:input={handleFirstnameInput}
						/>
						<input
							type="text"
							class="text-2xl font-semibold text-black bg-none rounded-sm px-2 -translate-x-2"
							size={lastnameInput.length}
							bind:value={lastnameInput}
							on:input={handleLastnameInput}
						/>
					</div>
				{:else}
					<div class="flex justify-center">
						<h1 class="text-2xl -ml-2 font-semibold w-fit">
							{firstnameInput}{' '}
							{lastnameInput}
						</h1>
					</div>
				{/if}
				<Image {editing} {selectedRelative} />
				<div class="ml-2">
					<h3 class="-ml-2 font-bold text-lg text-accent-1">Born</h3>
					{#if editing}
						<input
							class="text-black"
							type="number"
							bind:value={birthyearInput}
							on:input={handleBirthYearInput}
						/>
					{:else}
						<p class="">
							{birthyearInput || '-'}
						</p>
					{/if}
				</div>
				<div class="ml-2">
					<h3 class="-ml-2 font-bold text-lg text-accent-1">About</h3>
					<!-- {#if editing} -->
					<textarea
						class="bg-transparent whitespace-pre-wrap w-full overflow-hidden"
						disabled={!editing}
						class:bg-white={editing}
						class:resize-none={!editing}
						class:text-black={editing}
						style={`height: ${descriptionInputElement?.scrollHeight}px`}
						value={descriptionInput || '-'}
						bind:this={descriptionInputElement}
						on:input={handleDescriptionInput}
					/>
				</div>
			</div>
			<div class="flex flex-col justify-center gap-4 w-full">
				<div class="mx-1 h-[2px] bg-accent-1 max-w-full" />
				<div class="flex justify-end relative">
					<div
						aria-hidden={!loadingDBWrite}
						class:opacity-100={loadingDBWrite}
						class="flex absolute left-0 top-2 gap-2 opacity-0 transition-opacity"
					>
						<span class="animate-spin w-min h-min">
							<ProgessIcon />
						</span> Saving...
					</div>
					<div
						aria-hidden={!savedDBWrite}
						class:-translate-x-12={!savedDBWrite}
						class={`flex absolute left-0 top-2 gap-2 opacity-100 transition-transform duration-400`}
					>
						<span class="w-min h-min text-green-400 shadow-sm">
							<CheckIcon />
						</span>
					</div>

					<Button
						disabled={!session}
						onClick={() => {
							editing = !editing;
							savedDBWrite = false;
						}}
					>
						{#if editing}
							<div class="flex gap-1">
								<EditStopIcon /> Stop Editing
							</div>
						{:else}
							<div class="flex gap-1">
								<EditIcon /> Edit
							</div>
						{/if}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
