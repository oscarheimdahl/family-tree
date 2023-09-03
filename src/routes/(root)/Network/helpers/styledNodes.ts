import type { MyNode } from '$lib/types/types';
import { partnerColors } from './networkOptions';

const partnerPairs: { from: string; to: string }[] = [];

export function getPartnerPairs() {
	return partnerPairs;
}

function commonOptions(node: MyNode) {
	return node;
}

export function partner(node: MyNode, from: string) {
	node = commonOptions(node);
	node.color = partnerColors;
	node.partner = true;

	partnerPairs.push({ from, to: node.id as string });
	node.shadow = false;
	node.borderWidth = 5;
	node.shapeProperties = { borderRadius: 2 };
	node.font = { size: 12 };
	return node;
}

export function relative(node: MyNode) {
	node = commonOptions(node);
	if (typeof node.color === 'object') {
		node.color.background = '#3F52B6';
		node.color.hover = '#3F52B6';
		node.color.highlight = '#3F52B6';
		node.color.border = '#3F52B6';
	}

	return node;
}
