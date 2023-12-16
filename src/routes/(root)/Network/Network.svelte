<script lang="ts">
	import Options from './Options.svelte';
	import { partnerinator } from './helpers/partnerinator';
	import { onMount } from 'svelte';
	import { networkOptions } from './helpers/networkOptions';
	import {
		partner,
		getPartnerPairs,
		relative,
		parentConnector as familyLink,
		childConnector,
	} from './helpers/styledNodes';
	import { Network, type Edge } from 'vis-network';
	import { DataSet } from 'vis-data';
	import type { MyNode, Relative } from '$lib/types/types';
	import { formatFullName } from './helpers/formatFullName';
	import { setSelectedRelative, store } from '$lib/store';

	let network: Network | undefined;
	let hierarchyMode = false;
	let hidePartners = false;
	let container: HTMLDivElement;
	let nodes: DataSet<MyNode, 'id'>;

	export let relatives: Relative[];
	onMount(() => {
		if (!relatives) return;
		store.update((prev) => ({ ...prev, relatives }));
		buildNetwork2();
		network = buildNetwork();
		// network.on('click', (e) => {
		// 	const nodeId = e.nodes[0];
		// 	// if (!nodeId) return;
		// 	// console.log(nodeId);
		// 	const clickedRelative = relatives.find((relative) => relative.id === nodeId);
		// 	if (clickedRelative) setSelectedRelative(clickedRelative);
		// 	else setSelectedRelative(undefined);

		// 	// store.update((prev) => ({ ...prev, selectedRelativeId: nodeId }));
		// });
	});

	function buildNetwork2() {}

	function buildNetwork() {
		if (!relatives) throw new Error('No relatives data');

		const nodesList: MyNode[] = [
			relative({
				id: 'rune-pettersson',
				label: 'Rune Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				x: -200,
				y: -200,
			}),
			partner({
				id: 'kerstin-pettersson',
				label: 'Kerstin Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				x: 0,
				y: -200,
			}),
			familyLink({
				id: 'rune-pettersson_kerstin-pettersson',
				label: '',
				x: -100,
				y: -200,
			}),
			// Johan
			relative({
				id: 'johan-pettersson',
				label: 'Johan Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'johan-pettersson_ingela-heimdahl',
				x: 0,
				y: 0,
			}),
			partner({
				id: 'ingela-heimdahl',
				label: 'Ingela Heimdahl',
				relationshipId: 'johan-pettersson_ingela-heimdahl',
				x: 200,
				y: 0,
			}),
			familyLink({
				id: 'johan-pettersson_ingela-heimdahl',
				label: '',
				x: 100,
				y: 0,
			}),
			relative({
				id: 'lina-heimdahl',
				label: 'Lina Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: -400,
				y: 200,
			}),
			relative({
				id: 'gustav-heimdahl',
				label: 'Gustav Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: -200,
				y: 200,
			}),
			relative({
				id: 'oscar-heimdahl',
				label: 'Oscar Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 0,
				y: 200,
			}),
			relative({
				id: 'anna-heimdahl',
				label: 'Anna Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 200,
				y: 200,
			}),
			relative({
				id: 'agnes-heimdahl',
				label: 'Agnes Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 400,
				y: 200,
			}),
			relative({
				id: 'elsa-heimdahl',
				label: 'Elsa Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 600,
				y: 200,
			}),
			// Eva
			relative({
				id: 'eva-pettersson',
				label: 'Eva Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'eva-pettersson_prayadh-kullapa',
				x: -1300,
				y: 0,
			}),
			partner({
				id: 'prayadh-kullapa',
				label: 'Prayadh Kullapa',
				relationshipId: 'eva-pettersson_prayadh-kullapa',
				x: -1100,
				y: 0,
			}),
			familyLink({
				id: 'eva-pettersson_prayadh-kullapa',
				label: '',
				x: -1200,
				y: 0,
			}),
			relative({
				id: 'åsa-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'åsa-kullapa_vince-alaras',
				label: 'Åsa Kullapa',
				x: -1700,
				y: 200,
			}),
			partner({
				id: 'vince-alaras',
				label: 'Vince Alaras',
				relationshipId: 'åsa-kullapa_vince-alaras',
				x: -1500,
				y: 200,
			}),
			familyLink({
				id: 'åsa-kullapa_vince-alaras',
				label: '',
				x: -1600,
				y: 200,
			}),
			relative({
				id: 'malin-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'malin-kullapa_john-lundmark',
				label: 'Malin Kullapa',
				x: -1300,
				y: 200,
			}),
			partner({
				id: 'john-lundmark',
				relationshipId: 'malin-kullapa_john-lundmark',
				label: 'John Lundmark',
				x: -1100,
				y: 200,
			}),
			familyLink({
				id: 'malin-kullapa_john-lundmark',
				label: '',
				x: -1200,
				y: 200,
			}),
			relative({
				id: 'dan-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'dan-kullapa_tess',
				label: 'Dan Kullapa',
				x: -900,
				y: 200,
			}),
			partner({
				id: 'tess',
				relationshipId: 'dan-kullapa_tess',
				label: 'Therese',
				x: -700,
				y: 200,
			}),
			familyLink({
				id: 'dan-kullapa_tess',
				label: '',
				x: -800,
				y: 200,
			}),
			// Hanna
			relative({
				id: 'hanna-asp',
				label: 'Hanna\nAsp',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'hanna-asp_petter-asp',
				x: 1100,
				y: 0,
			}),
			partner({
				id: 'petter-asp',
				label: 'Petter\nAsp',
				relationshipId: 'hanna-asp_petter-asp',
				x: 1300,
				y: 0,
			}),
			familyLink({
				id: 'hanna-asp_petter-asp',
				label: '',
				x: 1200,
				y: 0,
			}),
			relative({
				id: 'ebba-asp',
				parentsId: 'hanna-asp_petter-asp',
				relationshipId: 'ebba-asp_sebastian-lind',
				label: 'Ebba\nAsp',
				x: 900,
				y: 200,
			}),
			partner({
				id: 'sebastian-lind',
				relationshipId: 'ebba-asp_sebastian-lind',
				label: 'Sebastian Lind',
				x: 1100,
				y: 200,
			}),
			familyLink({
				id: 'ebba-asp_sebastian-lind',
				label: '',
				x: 1000,
				y: 200,
			}),
			relative({
				id: 'ted-asp',
				parentsId: 'ebba-asp_sebastian-lind',
				label: 'Ted\nAsp?',
				x: 1000,
				y: 400,
			}),
			relative({
				id: 'erik-asp',
				parentsId: 'hanna-asp_petter-asp',
				label: 'Erik\nAsp',
				x: 1300,
				y: 200,
			}),
			relative({
				id: 'arvid-asp',
				parentsId: 'hanna-asp_petter-asp',
				label: 'Arvid\nAsp',
				x: 1500,
				y: 200,
			}),
		];
		const edges: Edge[] = [];
		const elbowNodes: MyNode[] = [];
		nodesList.forEach((child) => {
			const familyLink = nodesList.find((node) => node.id === child.parentsId);
			const familyLinkId = familyLink?.id?.toString() ?? '';
			const childId = child.id?.toString() ?? '';
			if (familyLinkId.includes(childId)) return;
			if (!familyLink) return;
			const elbowConnector1 = childConnector({
				id: crypto.randomUUID(),
				label: '',
				x: familyLink.x,
				y: (familyLink.y ?? 0) + 100,
			});
			const elbowConnector2 = childConnector({
				id: crypto.randomUUID(),
				parentsId: elbowConnector1.id?.toString() ?? '',
				label: '',
				x: child.x,
				y: (familyLink.y ?? 0) + 100,
			});
			elbowNodes.push(elbowConnector1);
			elbowNodes.push(elbowConnector2);

			edges.push({
				from: familyLinkId,
				to: elbowConnector1.id,
			});
			edges.push({
				from: elbowConnector1.id,
				to: elbowConnector2.id,
			});
			child.parentsId = elbowConnector2.id?.toString();
		});

		nodesList.forEach((node) => {
			if (node.parentsId)
				edges.push({
					from: node.id,
					to: node.parentsId,
				});
			if (node.relationshipId)
				edges.push({
					from: node.id,
					to: node.relationshipId,
				});
		});

		nodes = new DataSet([...nodesList, ...elbowNodes]);

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
