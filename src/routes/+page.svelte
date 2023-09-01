<script lang="ts">
	import Drawer from './Drawer/Drawer.svelte';
	import Network from './Network/Network.svelte';

	export let data;
</script>

{#if data.relatives}
	<div class="flex h-full">
		<Network relatives={data.relatives} />
		<Drawer />
	</div>
{/if}

<!-- <div class="absolute top-0 right-0 m-4 flex flex-col gap-2">
	<button
		class=" p-2 bg-red-400 rounded-md"
		on:click={() => {
			hidePartners = !hidePartners;
			nodes.forEach((node) => {
				if (!node.id) return;
				if (node.partner) {
					nodes.update({ id: node.id, hidden: hidePartners });
				}
			});
		}}
	>
		Hide partners
	</button>
	<button
		class=" p-2 bg-red-400 rounded-md"
		on:click={() => {
			hierarchyMode = !hierarchyMode;
			buildNetwork();
		}}
	>
		Hierarchy
	</button>
</div> -->
