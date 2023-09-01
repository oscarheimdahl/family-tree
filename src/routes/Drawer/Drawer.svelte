<script lang="ts">
	import { relativesStore, selectedRelativeIdStore } from '$lib/store/relative';
	import type { Relative } from '$lib/types/types';
	import { formatFullName } from '../Network/helpers/formatFullName';

	let selectedRelative: Relative | undefined;
	let relatives: Relative[];

	selectedRelativeIdStore.subscribe(
		(val) => (selectedRelative = relatives?.find((relative) => relative.id === val))
	);
	relativesStore.subscribe((val) => (relatives = val));
</script>

<div
	aria-hidden={!selectedRelative}
	class:translate-x-full={!selectedRelative}
	class="absolute h-[calc(100%-1rem)] w-80 mt-4 p-4 right-0 text-white bg-[#3D3D52] shadow-lg transition-transform rounded-l-md"
>
	{#if selectedRelative}
		<div class="flex flex-col gap-2">
			<h1 class="text-xl font-semibold">
				{formatFullName(selectedRelative.firstname, selectedRelative.lastname)}
			</h1>
			<img
				class="rounded-md m-2"
				src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
				alt={`picture of ${selectedRelative.firstname}`}
			/>
			<p>Boy let me tell you about this guy, this is a real golden egg.</p>
		</div>
	{/if}
</div>
