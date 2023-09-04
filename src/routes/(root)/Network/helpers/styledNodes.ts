import type { MyNode } from '$lib/types/types';
import { partnerColor } from './networkOptions';

const partnerPairs: { from: string; to: string }[] = [];

export function getPartnerPairs() {
	return partnerPairs;
}

function commonOptions(node: MyNode) {
	return node;
}

export function partner(node: MyNode, from: string) {
	node = commonOptions(node);
	node.color = {
		background: partnerColor,
		highlight: partnerColor,
		hover: partnerColor,
		border: partnerColor
	};
	node.partner = true;

	partnerPairs.push({ from, to: node.id as string });
	// node.shadow = false;
	node.borderWidth = 5;
	node.shapeProperties = { borderRadius: 2 };
	node.font = { size: 12 };
	return node;
}

export function relative(node: MyNode) {
	node = commonOptions(node);

	return node;
}
