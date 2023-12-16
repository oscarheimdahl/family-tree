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
		network = buildNetwork();
		network.on('click', (e) => {
			setSelectedRelative('');
			const nodeId = e.nodes[0];
			if (!nodeId) return;
			setSelectedRelative(nodeId);
		});
	});

	function buildNetwork() {
		if (!relatives) throw new Error('No relatives data');
		const yStep = 200;
		const augustaPos = 2000;
		const nodesList: MyNode[] = [
			relative({
				id: 'larsolof-pettersson',
				label: 'Lars Olof Pettersson',
				relationshipId: 'larsolof-pettersson_larsolofwife',
				x: 500,
				y: 0 * yStep,
			}),
			familyLink({
				id: 'larsolof-pettersson_larsolofwife',
				label: '',
				x: 600,
				y: 0 * yStep,
			}),
			partner({
				id: 'larsolofwife',
				relationshipId: 'larsolof-pettersson_larsolofwife',
				label: '?\n',
				x: 700,
				y: 0 * yStep,
			}),
			relative({
				id: 'larsolof-pettersson2',
				label: 'Lars Olof Pettersson',
				parentsId: 'larsolof-pettersson_larsolofwife',
				relationshipId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -900,
				y: 1 * yStep,
			}),
			relative({
				id: 'albert-pettersson',
				label: 'Albert Pettersson',
				parentsId: 'larsolof-pettersson_larsolofwife',
				x: -500,
				y: 1 * yStep,
			}),
			relative({
				id: 'emma-pettersson',
				label: 'Emma Pettersson',
				parentsId: 'larsolof-pettersson_larsolofwife',
				x: -300,
				y: 1 * yStep,
			}),
			relative({
				id: 'augusta-pettersson',
				label: 'Augusta Pettersson',
				parentsId: 'larsolof-pettersson_larsolofwife',
				relationshipId: 'augusta-pettersson_augustahusband',
				x: augustaPos,
				y: 1 * yStep,
			}),
			familyLink({
				id: 'augusta-pettersson_augustahusband',
				label: '',
				x: augustaPos + 100,
				y: 1 * yStep,
			}),
			partner({
				id: 'augustahusband',
				relationshipId: 'augusta-pettersson_augustahusband',
				label: '?\n',
				x: augustaPos + 200,
				y: 1 * yStep,
			}),
			relative({
				id: 'lenay',
				label: 'Lenay\n',
				parentsId: 'augusta-pettersson_augustahusband',
				relationshipId: 'lenay_lenayhusband',
				x: augustaPos - 200,
				y: 2 * yStep,
			}),
			familyLink({
				id: 'lenay_lenayhusband',
				label: '',
				x: augustaPos - 100,
				y: 2 * yStep,
			}),
			partner({
				id: 'lenayhusband',
				label: '?\n',
				relationshipId: 'lenay_lenayhusband',
				x: augustaPos,
				y: 2 * yStep,
			}),
			relative({
				id: 'lester',
				label: 'Lester\n',
				parentsId: 'lenay_lenayhusband',
				relationshipId: 'lester_lesterwife',
				x: augustaPos - 100,
				y: 3 * yStep,
			}),
			familyLink({
				id: 'lester_lesterwife',
				x: augustaPos,
				y: 3 * yStep,
			}),
			partner({
				id: 'lesterwife',
				relationshipId: 'lester_lesterwife',
				label: '?\n',
				x: augustaPos + 100,
				y: 3 * yStep,
			}),
			relative({
				id: 'george',
				parentsId: 'lester_lesterwife',
				label: 'George\n',
				x: augustaPos - 200,
				y: 4 * yStep,
			}),
			relative({
				id: 'chris',
				parentsId: 'lester_lesterwife',
				label: 'Chris\n',
				x: augustaPos,
				y: 4 * yStep,
			}),
			relative({
				id: 'cathy',
				parentsId: 'lester_lesterwife',
				relationshipId: 'cathy_cathyhusband',
				label: 'Cathy\n',
				x: augustaPos + 200,
				y: 4 * yStep,
			}),
			familyLink({
				id: 'cathy_cathyhusband',
				x: augustaPos + 300,
				y: 4 * yStep,
			}),
			partner({
				id: 'cathyhusband',
				relationshipId: 'cathy_cathyhusband',
				label: '?\n',
				x: augustaPos + 400,
				y: 4 * yStep,
			}),
			relative({
				id: 'taylor',
				parentsId: 'cathy_cathyhusband',
				label: 'Taylor\n',
				x: augustaPos + 200,
				y: 5 * yStep,
			}),
			relative({
				id: 'patrick',
				parentsId: 'cathy_cathyhusband',
				label: 'Patrick\n',
				x: augustaPos + 400,
				y: 5 * yStep,
			}),

			relative({
				id: 'clyde',
				label: 'Clyde\n',
				parentsId: 'augusta-pettersson_augustahusband',
				relationshipId: 'clyde_clydewife',
				x: augustaPos + 400,
				y: 2 * yStep,
			}),
			familyLink({
				id: 'clyde_clydewife',
				label: '',
				x: augustaPos + 500,
				y: 2 * yStep,
			}),
			partner({
				id: 'clydewife',
				label: '?\n',
				relationshipId: 'clyde_clydewife',
				x: augustaPos + 600,
				y: 2 * yStep,
			}),
			relative({
				id: 'robert',
				label: 'Robert\n',
				parentsId: 'clyde_clydewife',
				x: augustaPos + 400,
				y: 3 * yStep,
			}),
			relative({
				id: 'howard',
				label: 'Howard\n',
				parentsId: 'clyde_clydewife',
				x: augustaPos + 600,
				y: 3 * yStep,
			}),

			familyLink({
				id: 'larsolof-pettersson2_josefinaamalia-pettersson',
				label: '',
				x: -800,
				y: 1 * yStep,
			}),
			partner({
				id: 'josefinaamalia-pettersson',
				relationshipId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				label: 'Josefina Amalia Pettersson',
				x: -700,
				y: 1 * yStep,
			}),

			relative({
				id: 'berta-pettersson',
				label: 'Berta Pettersson',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -500,
				y: 2 * yStep,
			}),
			relative({
				id: 'josef-pettersson',
				label: 'Josef Pettersson',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -700,
				y: 2 * yStep,
			}),
			relative({
				id: 'sigge-pettersson',
				label: 'Sigge Pettersson',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -900,
				y: 2 * yStep,
			}),
			relative({
				id: 'lambert-pettersson',
				label: 'Lambert Pettersson',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -1100,
				y: 2 * yStep,
			}),
			relative({
				id: 'emil-pettersson',
				label: 'Emil Pettersson',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -1300,
				y: 2 * yStep,
			}),

			relative({
				id: 'manne-pettersson',
				label: 'Manne Pettersson',
				relationshipId: 'manne-pettersson_mannewife',
				parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
				x: -300,
				y: 2 * yStep,
			}),
			familyLink({
				id: 'manne-pettersson_mannewife',
				label: '',
				x: -200,
				y: 2 * yStep,
			}),
			partner({
				id: 'mannewife',
				relationshipId: 'manne-pettersson_mannewife',
				label: '?\n',
				x: -100,
				y: 2 * yStep,
			}),

			// Rune
			relative({
				id: 'rune-pettersson',
				label: 'Rune Pettersson',
				parentsId: 'manne-pettersson_mannewife',
				relationshipId: 'rune-pettersson_kerstin-pettersson',
				x: -200,
				y: 3 * yStep,
			}),
			familyLink({
				id: 'rune-pettersson_kerstin-pettersson',
				label: '',
				x: -100,
				y: 3 * yStep,
			}),
			partner({
				id: 'kerstin-pettersson',
				label: 'Kerstin Pettersson',
				relationshipId: 'rune-pettersson_kerstin-pettersson',
				x: 0,
				y: 3 * yStep,
			}),

			// Johan
			relative({
				id: 'johan-pettersson',
				label: 'Johan Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'johan-pettersson_ingela-heimdahl',
				x: 0,
				y: 4 * yStep,
			}),
			familyLink({
				id: 'johan-pettersson_ingela-heimdahl',
				label: '',
				x: 100,
				y: 4 * yStep,
			}),
			partner({
				id: 'ingela-heimdahl',
				label: 'Ingela Heimdahl',
				relationshipId: 'johan-pettersson_ingela-heimdahl',
				x: 200,
				y: 4 * yStep,
			}),
			relative({
				id: 'lina-heimdahl',
				label: 'Lina Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: -400,
				y: 5 * yStep,
			}),
			relative({
				id: 'gustav-heimdahl',
				label: 'Gustav Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: -200,
				y: 5 * yStep,
			}),
			relative({
				id: 'oscar-heimdahl',
				label: 'Oscar Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 0,
				y: 5 * yStep,
			}),
			relative({
				id: 'anna-heimdahl',
				label: 'Anna Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 200,
				y: 5 * yStep,
			}),
			relative({
				id: 'agnes-heimdahl',
				label: 'Agnes Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 400,
				y: 5 * yStep,
			}),
			relative({
				id: 'elsa-heimdahl',
				label: 'Elsa Heimdahl',
				parentsId: 'johan-pettersson_ingela-heimdahl',
				x: 600,
				y: 5 * yStep,
			}),

			// Eva
			relative({
				id: 'eva-pettersson',
				label: 'Eva Pettersson',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'eva-pettersson_prayadh-kullapa',
				x: -1550,
				y: 4 * yStep,
			}),
			familyLink({
				id: 'eva-pettersson_prayadh-kullapa',
				label: '',
				x: -1450,
				y: 4 * yStep,
			}),
			partner({
				id: 'prayadh-kullapa',
				label: 'Prayadh Kullapa',
				relationshipId: 'eva-pettersson_prayadh-kullapa',
				x: -1350,
				y: 4 * yStep,
			}),
			relative({
				id: 'åsa-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'åsa-kullapa_vince-alaras',
				label: 'Åsa Kullapa',
				x: -2000,
				y: 5 * yStep,
			}),
			familyLink({
				id: 'åsa-kullapa_vince-alaras',
				label: '',
				x: -1900,
				y: 5 * yStep,
			}),
			partner({
				id: 'vince-alaras',
				label: 'Vince Alaras',
				relationshipId: 'åsa-kullapa_vince-alaras',
				x: -1800,
				y: 5 * yStep,
			}),
			relative({
				id: 'clara-kullapa',
				parentsId: 'åsa-kullapa_vince-alaras',
				label: 'Clara Kullapa',
				x: -2100,
				y: 6 * yStep,
			}),
			relative({
				id: 'alva-kullapa',
				parentsId: 'åsa-kullapa_vince-alaras',
				label: 'Alva Kullapa',
				x: -1900,
				y: 6 * yStep,
			}),
			relative({
				id: 'ella-kullapa',
				parentsId: 'åsa-kullapa_vince-alaras',
				label: 'Ella Kullapa',
				x: -1700,
				y: 6 * yStep,
			}),
			relative({
				id: 'malin-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'malin-kullapa_john-malmlund',
				label: 'Malin Kullapa',
				x: -1400,
				y: 5 * yStep,
			}),
			familyLink({
				id: 'malin-kullapa_john-malmlund',
				label: '',
				x: -1300,
				y: 5 * yStep,
			}),
			partner({
				id: 'john-malmlund',
				relationshipId: 'malin-kullapa_john-malmlund',
				label: 'John Malmlund',
				x: -1200,
				y: 5 * yStep,
			}),
			relative({
				id: 'olive-kullapa',
				parentsId: 'malin-kullapa_john-malmlund',
				label: 'Olive Kullapa',
				x: -1400,
				y: 6 * yStep,
			}),
			relative({
				id: 'zoe-kullapa',
				parentsId: 'malin-kullapa_john-malmlund',
				label: 'Zoe Kullapa',
				x: -1200,
				y: 6 * yStep,
			}),
			relative({
				id: 'dan-kullapa',
				parentsId: 'eva-pettersson_prayadh-kullapa',
				relationshipId: 'dan-kullapa_therese-vindahl',
				label: 'Dan Kullapa',
				x: -900,
				y: 5 * yStep,
			}),
			familyLink({
				id: 'dan-kullapa_therese-vindahl',
				label: '',
				x: -800,
				y: 5 * yStep,
			}),
			partner({
				id: 'therese-vindahl',
				relationshipId: 'dan-kullapa_therese-vindahl',
				label: 'Therese Vindahl',
				x: -700,
				y: 5 * yStep,
			}),

			relative({
				id: 'viola-kullapa',
				parentsId: 'dan-kullapa_therese-vindahl',
				label: 'Viola Kullapa',
				x: -900,
				y: 6 * yStep,
			}),
			relative({
				id: 'baby-kullapa',
				parentsId: 'dan-kullapa_therese-vindahl',
				label: 'Baby Kullapa',
				x: -700,
				y: 6 * yStep,
			}),

			// Hanna
			relative({
				id: 'hanna-asp',
				label: 'Hanna\nAsp',
				parentsId: 'rune-pettersson_kerstin-pettersson',
				relationshipId: 'hanna-asp_petter-asp',
				x: 1100,
				y: 4 * yStep,
			}),
			familyLink({
				id: 'hanna-asp_petter-asp',
				label: '',
				x: 1200,
				y: 4 * yStep,
			}),
			partner({
				id: 'petter-asp',
				label: 'Petter\nAsp',
				relationshipId: 'hanna-asp_petter-asp',
				x: 1300,
				y: 4 * yStep,
			}),
			relative({
				id: 'ebba-asp',
				parentsId: 'hanna-asp_petter-asp',
				relationshipId: 'ebba-asp_sebastian-lind',
				label: 'Ebba\nAsp',
				x: 900,
				y: 5 * yStep,
			}),
			familyLink({
				id: 'ebba-asp_sebastian-lind',
				label: '',
				x: 1000,
				y: 5 * yStep,
			}),
			partner({
				id: 'sebastian-lind',
				relationshipId: 'ebba-asp_sebastian-lind',
				label: 'Sebastian Lind',
				x: 1100,
				y: 5 * yStep,
			}),
			relative({
				id: 'ted-asp',
				parentsId: 'ebba-asp_sebastian-lind',
				label: 'Ted\nAsp?',
				x: 1000,
				y: 6 * yStep,
			}),
			relative({
				id: 'erik-asp',
				parentsId: 'hanna-asp_petter-asp',
				label: 'Erik\nAsp',
				x: 1300,
				y: 5 * yStep,
			}),
			relative({
				id: 'arvid-asp',
				parentsId: 'hanna-asp_petter-asp',
				label: 'Arvid\nAsp',
				x: 1500,
				y: 5 * yStep,
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
				y: (familyLink.y ?? 0) + yStep / 2,
			});
			const elbowConnector2 = childConnector({
				id: crypto.randomUUID(),
				parentsId: elbowConnector1.id?.toString() ?? '',
				label: '',
				x: child.x,
				y: (familyLink.y ?? 0) + yStep / 2,
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
