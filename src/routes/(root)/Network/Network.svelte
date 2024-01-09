<script lang="ts">
	import { setSelectedRelative, store } from '$lib/store';
	import type { MyNode, Relative } from '$lib/types/types';
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network, type Edge } from 'vis-network';
	import Options from './Options.svelte';
	import { networkOptions } from './helpers/networkOptions';
	import { getTreeData, labeler } from './helpers/nodeList';
	import { childConnector } from './helpers/styledNodes';

	let hidePartners = false;
	let container: HTMLDivElement;
	let nodes: DataSet<MyNode, 'id'>;

	export let relatives: Relative[];

	onMount(() => {
		if (!relatives) return;
		store.update((prev) => ({ ...prev, relatives }));

		const network = buildNetwork(relatives);
		network.on('click', (e) => {
			setSelectedRelative('');
			const nodeId = e.nodes[0];
			if (!nodeId) return;
			setSelectedRelative(nodeId);
		});
		store.subscribe((val) => {
			const updatedNodes: MyNode[] = [];
			nodes.forEach((node) => {
				const stateRelative = val.relatives.find((relative) => {
					return relative.id === node.id;
				});
				if (!stateRelative) return;
				const newNode: MyNode = {
					...node,
					label: labeler(stateRelative, { noLabel: !!node.familyLink }),
				};
				updatedNodes.push(newNode);
			});
			nodes.update(updatedNodes);
		});
	});

	function buildNetwork(relatives: Relative[]) {
		const { nodeList, elbowNodes, edges } = getTreeData(relatives);
		nodes = new DataSet([...nodeList, ...elbowNodes]);

		return new Network(
			container,
			{
				nodes,
				edges,
			},
			networkOptions,
		);
	}

	function handleHidePartnerClick() {
		hidePartners = !hidePartners;
		const nodesToUpdate: MyNode[] = [];
		nodes.forEach((node) => {
			if (node.partner) nodesToUpdate.push({ id: node.id, hidden: hidePartners });
		});
		nodes.update(nodesToUpdate);
	}
</script>

<div class="flex w-full h-full fade-in" bind:this={container} />
<Options {handleHidePartnerClick} />
