<script lang="ts">
	import { partnerinator } from '$lib/partnerinator';
	import { onMount } from 'svelte';
	// import { Network, type Node, type Edge, type Data, type Options } from 'vis-network';
	import { networkOptions } from '$lib/networkOptions';
	import { relativesStore, selectedRelativeIdStore } from '$lib/store/relative';
	import { partner, getPartnerPairs, relative } from '$lib/styledNodes';
	import { Network, type Edge } from 'vis-network';
	import { DataSet } from 'vis-data';
	import type { MyNode } from '../types/types';

	let network: Network | undefined;
	let hierarchyMode = false;
	let hidePartners = false;
	let container: HTMLDivElement;
	let nodes: DataSet<MyNode, 'id'>;

	export let data;
	onMount(() => {
		if (!data.relatives) return;
		relativesStore.set(data.relatives);
		network = buildNetwork();
		network.on('click', (e) => {
			const nodeId = e.nodes[0];
			selectedRelativeIdStore.set(nodeId);
		});
	});

	function buildNetwork() {
		if (!data.relatives) throw new Error('No relatives data');
		nodes = new DataSet(
			data.relatives?.map((relativeData) => {
				const relativeNode = {
					id: relativeData.id,
					label: `${relativeData.firstname} ${relativeData.lastname}`,
					level: 1
				};
				if (!relativeData.partnerTo) return relative(relativeNode);
				return partner(relativeNode, relativeData.partnerTo, hidePartners);
			})
		);
		const edges: Edge[] = data.relatives.map((relativeData) => {
			return { from: relativeData.childOf, to: relativeData.id };
		});

		getPartnerPairs().forEach(({ from, to }) => {
			edges.push(...partnerinator({ from, to }, edges, hierarchyMode));
		});

		networkOptions.layout.hierarchical.enabled = hierarchyMode;
		return new Network(container, { nodes, edges }, networkOptions);
	}
</script>

<div class=" bg-gray-400 flex w-full h-full" bind:this={container} />

<div class="absolute top-0 right-0 m-4 flex flex-col gap-2">
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
	<!-- <button
		class=" p-2 bg-red-400 rounded-md"
		on:click={() => {
			hierarchyMode = !hierarchyMode;
			buildNetwork();
		}}
	>
		Hierarchy
	</button> -->
</div>
