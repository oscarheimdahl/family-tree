<script lang="ts">
	import { relativesStore, selectedRelativeIdStore } from '$lib/store/relative';

	import '../app.css';
	import type { Relative } from './+page.server';
	let selectedRelativeId: string;
	let relatives: Relative[];
	selectedRelativeIdStore.subscribe((val) => {
		selectedRelativeId = val;
	});
	relativesStore.subscribe((val) => {
		relatives = val;
	});
</script>

<button
	on:click={() => {
		const relative = relatives.find((relative) => relative.id === selectedRelativeId);
		if (!relative) return;
		console.log(relative.firstname);
	}}>{selectedRelativeId}</button
>
<slot />
