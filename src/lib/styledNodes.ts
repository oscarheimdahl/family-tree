import type { MyNode } from '../types/types';

const partnerPairs: { from: string; to: string }[] = [];

export function getPartnerPairs() {
	return partnerPairs;
}

export function partner(node: MyNode, from: string, hidePartners: boolean) {
	node.color = { background: '#555', highlight: '#555', hover: '#555', border: '#555' };
	node.hidden = hidePartners;
	// @ts-ignore
	node.partner = true;
	partnerPairs.push({ from, to: node.id as string });

	return node;
}

export function relative(node: MyNode) {
	node.color = { background: '#3F52B6', highlight: '#3F52B6', hover: '#3F52B6', border: '#555' };
	// node.hidden = hidePartners;
	// partnerPairs.push({ from, to: node.id as string });

	return node;
}
