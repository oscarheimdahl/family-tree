import type { MyNode, Relative } from '$lib/types/types';
import type { Edge } from 'vis-network';
import { childConnector, familyLink, partner, relative } from './styledNodes';

const augustaPos = 2000;
export const yStep = 200;

export function labeler(relative?: Relative, options?: { noLabel: boolean }) {
	if (options?.noLabel) return '';
	const firstname = relative?.firstname ?? '';
	const lastname = relative?.lastname ?? '';
	const name = `${firstname} ${lastname}`;
	if (name.trim().length > 0) return name;
	return relative?.id;
}

function relativeToNodeCreator(relatives: Relative[]) {
	return function relativeToNode(id: string) {
		const relative = relatives.find((relative) => {
			return relative.id === id;
		});
		const label = labeler(relative);
		return { label, id };
	};
}

export function getTreeData(relatives: Relative[]) {
	const relativeToNode = relativeToNodeCreator(relatives);

	const elbowNodes: MyNode[] = [];
	const edges: Edge[] = [];
	const nodeList: MyNode[] = [
		relative({
			...relativeToNode('larsolof-pettersson'),
			relationshipId: 'larsolof-pettersson_larolofwife',
			x: 500,
			y: 0 * yStep,
		}),
		familyLink({
			...relativeToNode('larsolof-pettersson_larsolofwife'),
			x: 600,
			y: 0 * yStep,
		}),
		partner({
			...relativeToNode('larsolofwife'),
			relationshipId: 'larsolof-pettersson_larsolofwife',
			x: 700,
			y: 0 * yStep,
		}),
		relative({
			...relativeToNode('larsolof-pettersson2'),
			parentsId: 'larsolof-pettersson_larsolofwife',
			relationshipId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -2500,
			y: 1 * yStep,
		}),
		relative({
			...relativeToNode('albert-pettersson'),
			parentsId: 'larsolof-pettersson_larsolofwife',
			x: -500,
			y: 1 * yStep,
		}),
		relative({
			...relativeToNode('emma-pettersson'),
			parentsId: 'larsolof-pettersson_larsolofwife',
			x: -300,
			y: 1 * yStep,
		}),
		relative({
			...relativeToNode('augusta-pettersson'),
			parentsId: 'larsolof-pettersson_larsolofwife',
			relationshipId: 'augusta-pettersson_augustahusband',
			x: augustaPos,
			y: 1 * yStep,
		}),
		familyLink({
			...relativeToNode('augusta-pettersson_augustahusband'),
			x: augustaPos + 100,
			y: 1 * yStep,
		}),
		partner({
			...relativeToNode('augustahusband'),
			relationshipId: 'augusta-pettersson_augustahusband',
			x: augustaPos + 200,
			y: 1 * yStep,
		}),
		relative({
			...relativeToNode('lenay'),
			parentsId: 'augusta-pettersson_augustahusband',
			relationshipId: 'lenay_lenayhusband',
			x: augustaPos - 200,
			y: 2 * yStep,
		}),
		familyLink({
			...relativeToNode('lenay_lenayhusband'),
			x: augustaPos - 100,
			y: 2 * yStep,
		}),
		partner({
			...relativeToNode('lenayhusband'),
			relationshipId: 'lenay_lenayhusband',
			x: augustaPos,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('lester'),
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
			...relativeToNode('lesterwife'),
			relationshipId: 'lester_lesterwife',
			x: augustaPos + 100,
			y: 3 * yStep,
		}),
		relative({
			...relativeToNode('george'),
			parentsId: 'lester_lesterwife',
			x: augustaPos - 200,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('chris'),
			parentsId: 'lester_lesterwife',
			x: augustaPos,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('cathy'),
			parentsId: 'lester_lesterwife',
			relationshipId: 'cathy_cathyhusband',
			x: augustaPos + 200,
			y: 4 * yStep,
		}),
		familyLink({
			id: 'cathy_cathyhusband',
			x: augustaPos + 300,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('cathyhusband'),
			relationshipId: 'cathy_cathyhusband',
			x: augustaPos + 400,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('taylor'),
			parentsId: 'cathy_cathyhusband',
			x: augustaPos + 200,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('patrick'),
			parentsId: 'cathy_cathyhusband',
			x: augustaPos + 400,
			y: 5 * yStep,
		}),

		relative({
			...relativeToNode('clyde'),
			parentsId: 'augusta-pettersson_augustahusband',
			relationshipId: 'clyde_clydewife',
			x: augustaPos + 400,
			y: 2 * yStep,
		}),
		familyLink({
			...relativeToNode('clyde_clydewife'),
			x: augustaPos + 500,
			y: 2 * yStep,
		}),
		partner({
			...relativeToNode('clydewife'),
			relationshipId: 'clyde_clydewife',
			x: augustaPos + 600,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('robert'),
			parentsId: 'clyde_clydewife',
			x: augustaPos + 400,
			y: 3 * yStep,
		}),
		relative({
			...relativeToNode('howard'),
			parentsId: 'clyde_clydewife',
			x: augustaPos + 600,
			y: 3 * yStep,
		}),

		familyLink({
			...relativeToNode('larsolof-pettersson2_josefinaamalia-pettersson'),
			x: -2400,
			y: 1 * yStep,
		}),
		partner({
			...relativeToNode('josefinaamalia-pettersson'),
			relationshipId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -2300,
			y: 1 * yStep,
		}),
		relative({
			...relativeToNode('berta-pettersson'),
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			relationshipId: 'berta-pettersson_bill',
			x: -2600,
			y: 2 * yStep,
		}),

		familyLink({
			...relativeToNode('berta-pettersson_bill'),
			x: -2500,
			y: 2 * yStep,
		}),
		partner({
			...relativeToNode('bill'),
			relationshipId: 'berta-pettersson_bill',
			x: -2400,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('william-berta'),
			parentsId: 'berta-pettersson_bill',
			relationshipId: 'william-berta_william-berta-partner',
			x: -6600,
			y: 3 * yStep,
		}),
		familyLink({
			...relativeToNode('william-berta_william-berta-partner'),
			x: -6500,
			y: 3 * yStep,
		}),
		partner({
			...relativeToNode('william-berta-partner'),
			relationshipId: 'william-berta_william-berta-partner',
			x: -6400,
			y: 3 * yStep,
		}),

		// MARY ELLEN
		relative({
			...relativeToNode('maryellen-berta'),
			parentsId: 'william-berta_william-berta-partner',
			relationshipId: 'maryellen-berta_maryellen-berta-partner',
			x: -7200,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('maryellen-berta_maryellen-berta-partner'),
			x: -7100,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('maryellen-berta-partner'),
			relationshipId: 'maryellen-berta_maryellen-berta-partner',
			x: -7000,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('mary-berta'),
			parentsId: 'maryellen-berta_maryellen-berta-partner',
			x: -7300,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('george-berta'),
			parentsId: 'maryellen-berta_maryellen-berta-partner',
			x: -7100,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('james-berta'),
			parentsId: 'maryellen-berta_maryellen-berta-partner',
			x: -6900,
			y: 5 * yStep,
		}),
		///////
		// JODYANN
		relative({
			...relativeToNode('jodyann-berta'),
			parentsId: 'william-berta_william-berta-partner',
			relationshipId: 'jodyann-berta_jodyann-berta-partner',
			x: -6600,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('jodyann-berta_jodyann-berta-partner'),
			x: -6500,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('jodyann-berta-partner'),
			relationshipId: 'jodyann-berta_jodyann-berta-partner',
			x: -6400,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('elizabeth-berta'),
			parentsId: 'jodyann-berta_jodyann-berta-partner',
			x: -6500,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('louisa-berta'),
			parentsId: 'jodyann-berta_jodyann-berta-partner',
			x: -6300,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('williamrice-berta'),
			parentsId: 'jodyann-berta_jodyann-berta-partner',
			x: -6100,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('wyatt-berta'),
			parentsId: 'jodyann-berta_jodyann-berta-partner',
			x: -5900,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('charles-berta'),
			parentsId: 'jodyann-berta_jodyann-berta-partner',
			x: -5700,
			y: 5 * yStep,
		}),
		/////////
		// JENNIFER
		relative({
			...relativeToNode('jennifer-berta'),
			parentsId: 'william-berta_william-berta-partner',
			relationshipId: 'jennifer-berta_jennifer-berta-partner',
			x: -5400,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('jennifer-berta_jennifer-berta-partner'),
			x: -5300,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('jennifer-berta-partner'),
			relationshipId: 'jennifer-berta_jennifer-berta-partner',
			x: -5200,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('emma-berta'),
			parentsId: 'jennifer-berta_jennifer-berta-partner',
			x: -5300,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('mary2-berta'),
			parentsId: 'jennifer-berta_jennifer-berta-partner',
			x: -5100,
			y: 5 * yStep,
		}),
		/////////
		// WILLIAM2
		relative({
			...relativeToNode('william2-berta'),
			parentsId: 'william-berta_william-berta-partner',
			relationshipId: 'william2-berta_william2-berta-partner',
			x: -4800,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('william2-berta_william2-berta-partner'),
			x: -4700,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('william2-berta-partner'),
			relationshipId: 'william2-berta_william2-berta-partner',
			x: -4600,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('william3-berta'),
			parentsId: 'william2-berta_william2-berta-partner',
			x: -4700,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('howard-berta'),
			parentsId: 'william2-berta_william2-berta-partner',
			x: -4500,
			y: 5 * yStep,
		}),
		////////
		// SAMUEL
		relative({
			...relativeToNode('samuel-berta'),
			parentsId: 'berta-pettersson_bill',
			relationshipId: 'samuel-berta_samuel-berta-partner',
			x: -4300,
			y: 3 * yStep,
		}),
		familyLink({
			...relativeToNode('samuel-berta_samuel-berta-partner'),
			x: -4200,
			y: 3 * yStep,
		}),
		partner({
			...relativeToNode('samuel-berta-partner'),
			relationshipId: 'samuel-berta_samuel-berta-partner',
			x: -4100,
			y: 3 * yStep,
		}),
		relative({
			...relativeToNode('kathlyn-berta'),
			parentsId: 'samuel-berta_samuel-berta-partner',
			x: -4200,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('victoria-berta'),
			parentsId: 'samuel-berta_samuel-berta-partner',
			x: -4000,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('william4-berta'),
			parentsId: 'samuel-berta_samuel-berta-partner',
			x: -3800,
			y: 4 * yStep,
		}),
		///////
		// MANUEL
		relative({
			...relativeToNode('manuel-berta'),
			relationshipId: 'manuel-berta_manuel-berta-partner',
			parentsId: 'berta-pettersson_bill',
			x: -3500,
			y: 3 * yStep,
		}),
		familyLink({
			...relativeToNode('manuel-berta_manuel-berta-partner'),
			x: -3400,
			y: 3 * yStep,
		}),
		partner({
			...relativeToNode('manuel-berta-partner'),
			relationshipId: 'manuel-berta_manuel-berta-partner',
			x: -3300,
			y: 3 * yStep,
		}),
		relative({
			...relativeToNode('suzanne-berta'),
			parentsId: 'manuel-berta_manuel-berta-partner',
			x: -3600,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('johnscott-berta'),
			parentsId: 'manuel-berta_manuel-berta-partner',
			x: -3400,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('daniel-berta'),
			parentsId: 'manuel-berta_manuel-berta-partner',
			x: -3200,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('sally-berta'),
			parentsId: 'manuel-berta_manuel-berta-partner',
			x: -3000,
			y: 4 * yStep,
		}),
		//////////////
		relative({
			...relativeToNode('josef-pettersson'),
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -3400,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('sigge-pettersson'),
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -3200,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('lambert-pettersson'),
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -3000,
			y: 2 * yStep,
		}),
		relative({
			...relativeToNode('emil-pettersson'),
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -2800,
			y: 2 * yStep,
		}),

		relative({
			...relativeToNode('manne-pettersson'),
			relationshipId: 'manne-pettersson_mannewife',
			parentsId: 'larsolof-pettersson2_josefinaamalia-pettersson',
			x: -300,
			y: 2 * yStep,
		}),
		familyLink({
			...relativeToNode('manne-pettersson_mannewife'),
			x: -200,
			y: 2 * yStep,
		}),
		partner({
			...relativeToNode('mannewife'),
			relationshipId: 'manne-pettersson_mannewife',
			x: -100,
			y: 2 * yStep,
		}),

		// Rune
		relative({
			...relativeToNode('rune-pettersson'),
			parentsId: 'manne-pettersson_mannewife',
			relationshipId: 'rune-pettersson_kerstin-pettersson',
			x: -200,
			y: 3 * yStep,
		}),
		familyLink({
			...relativeToNode('rune-pettersson_kerstin-pettersson'),
			x: -100,
			y: 3 * yStep,
		}),
		partner({
			...relativeToNode('kerstin-pettersson'),
			relationshipId: 'rune-pettersson_kerstin-pettersson',
			x: 0,
			y: 3 * yStep,
		}),

		// Johan
		relative({
			...relativeToNode('johan-pettersson'),
			parentsId: 'rune-pettersson_kerstin-pettersson',
			relationshipId: 'johan-pettersson_ingela-heimdahl',
			x: 0,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('johan-pettersson_ingela-heimdahl'),
			x: 100,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('ingela-heimdahl'),
			relationshipId: 'johan-pettersson_ingela-heimdahl',
			x: 200,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('lina-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: -400,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('gustav-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: -200,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('oscar-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: 0,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('anna-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: 200,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('agnes-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: 400,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('elsa-heimdahl'),
			parentsId: 'johan-pettersson_ingela-heimdahl',
			x: 600,
			y: 5 * yStep,
		}),

		// Eva
		relative({
			...relativeToNode('eva-pettersson'),
			parentsId: 'rune-pettersson_kerstin-pettersson',
			relationshipId: 'eva-pettersson_prayadh-kullapa',
			x: -1550,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('eva-pettersson_prayadh-kullapa'),
			x: -1450,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('prayadh-kullapa'),
			relationshipId: 'eva-pettersson_prayadh-kullapa',
			x: -1350,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('åsa-kullapa'),
			parentsId: 'eva-pettersson_prayadh-kullapa',
			relationshipId: 'åsa-kullapa_vince-alaras',
			x: -2000,
			y: 5 * yStep,
		}),
		familyLink({
			...relativeToNode('åsa-kullapa_vince-alaras'),
			x: -1900,
			y: 5 * yStep,
		}),
		partner({
			...relativeToNode('vince-alaras'),
			relationshipId: 'åsa-kullapa_vince-alaras',
			x: -1800,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('clara-kullapa'),
			parentsId: 'åsa-kullapa_vince-alaras',
			x: -2100,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('alva-kullapa'),
			parentsId: 'åsa-kullapa_vince-alaras',
			x: -1900,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('ella-kullapa'),
			parentsId: 'åsa-kullapa_vince-alaras',
			x: -1700,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('malin-kullapa'),
			parentsId: 'eva-pettersson_prayadh-kullapa',
			relationshipId: 'malin-kullapa_john-malmlund',
			x: -1400,
			y: 5 * yStep,
		}),
		familyLink({
			...relativeToNode('malin-kullapa_john-malmlund'),
			x: -1300,
			y: 5 * yStep,
		}),
		partner({
			...relativeToNode('john-malmlund'),
			relationshipId: 'malin-kullapa_john-malmlund',
			x: -1200,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('olive-kullapa'),
			parentsId: 'malin-kullapa_john-malmlund',
			x: -1400,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('zoe-kullapa'),
			parentsId: 'malin-kullapa_john-malmlund',
			x: -1200,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('dan-kullapa'),
			parentsId: 'eva-pettersson_prayadh-kullapa',
			relationshipId: 'dan-kullapa_therese-vindahl',
			x: -900,
			y: 5 * yStep,
		}),
		familyLink({
			...relativeToNode('dan-kullapa_therese-vindahl'),
			x: -800,
			y: 5 * yStep,
		}),
		partner({
			...relativeToNode('therese-vindahl'),
			relationshipId: 'dan-kullapa_therese-vindahl',
			x: -700,
			y: 5 * yStep,
		}),

		relative({
			...relativeToNode('viola-kullapa'),
			parentsId: 'dan-kullapa_therese-vindahl',
			x: -900,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('baby-kullapa'),
			parentsId: 'dan-kullapa_therese-vindahl',
			x: -700,
			y: 6 * yStep,
		}),

		// Hanna
		relative({
			...relativeToNode('hanna-asp'),
			parentsId: 'rune-pettersson_kerstin-pettersson',
			relationshipId: 'hanna-asp_petter-asp',
			x: 1100,
			y: 4 * yStep,
		}),
		familyLink({
			...relativeToNode('hanna-asp_petter-asp'),
			x: 1200,
			y: 4 * yStep,
		}),
		partner({
			...relativeToNode('petter-asp'),
			relationshipId: 'hanna-asp_petter-asp',
			x: 1300,
			y: 4 * yStep,
		}),
		relative({
			...relativeToNode('ebba-asp'),
			parentsId: 'hanna-asp_petter-asp',
			relationshipId: 'ebba-asp_sebastian-lind',
			x: 900,
			y: 5 * yStep,
		}),
		familyLink({
			...relativeToNode('ebba-asp_sebastian-lind'),
			x: 1000,
			y: 5 * yStep,
		}),
		partner({
			...relativeToNode('sebastian-lind'),
			relationshipId: 'ebba-asp_sebastian-lind',
			x: 1100,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('ted-asp'),
			parentsId: 'ebba-asp_sebastian-lind',
			x: 1000,
			y: 6 * yStep,
		}),
		relative({
			...relativeToNode('erik-asp'),
			parentsId: 'hanna-asp_petter-asp',
			x: 1300,
			y: 5 * yStep,
		}),
		relative({
			...relativeToNode('arvid-asp'),
			parentsId: 'hanna-asp_petter-asp',
			x: 1500,
			y: 5 * yStep,
		}),
	];

	nodeList.forEach((child) => {
		const familyLink = nodeList.find((node) => node.id === child.parentsId);
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

	nodeList.forEach((node) => {
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

	return { nodeList, edges, elbowNodes };
}
