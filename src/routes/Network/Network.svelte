<script lang="ts">
	import { partnerinator } from './helpers/partnerinator';
	import { onMount } from 'svelte';
	import { networkOptions } from './helpers/networkOptions';
	import { relativesStore, selectedRelativeIdStore } from '$lib/store/relative';
	import { partner, getPartnerPairs, relative } from './helpers/styledNodes';
	import { Network, type Edge } from 'vis-network';
	import { DataSet } from 'vis-data';
	import type { MyNode, Relative } from '$lib/types/types';
	import { formatFullName } from './helpers/formatFullName';

	let network: Network | undefined;
	let hierarchyMode = false;
	let hidePartners = false;
	let container: HTMLDivElement;
	let nodes: DataSet<MyNode, 'id'>;

	export let relatives: Relative[];
	onMount(() => {
		if (!relatives) return;
		relativesStore.set(relatives);
		network = buildNetwork();
		network.on('click', (e) => {
			const nodeId = e.nodes[0];
			selectedRelativeIdStore.set(nodeId);
		});
	});

	function buildNetwork() {
		if (!relatives) throw new Error('No relatives data');
		nodes = new DataSet(
			relatives?.map((relativeData) => {
				const relativeNode = {
					id: relativeData.id,
					label: formatFullName(relativeData.firstname, relativeData.lastname),
					level: 1
				};
				if (!relativeData.partnerTo) return relative(relativeNode);
				return partner(relativeNode, relativeData.partnerTo, hidePartners);
			})
		);
		const edges: Edge[] = relatives.map((relativeData) => {
			return { from: relativeData.childOf, to: relativeData.id };
		});

		getPartnerPairs().forEach(({ from, to }) => {
			edges.push(...partnerinator({ from, to }, edges, hierarchyMode));
		});

		networkOptions.layout.hierarchical.enabled = hierarchyMode;
		return new Network(container, { nodes, edges }, networkOptions);
	}
</script>

<div class="flex w-full h-full fade-in" bind:this={container} />
<div class="text-white absolute top-0 left-0 bg-red-400">asd</div>
