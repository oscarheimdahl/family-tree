import type { MyNode } from '$lib/types/types';
import { partnerColor } from './networkOptions';

const partnerPairs: { from: string; to: string }[] = [];

export function getPartnerPairs() {
	return partnerPairs;
}

function commonOptions(node: MyNode) {
	return node;
}

export function partner(node: MyNode) {
	node = relative(node);
	node.color = {
		highlight: {
			border: 'white',
			background: partnerColor,
		},
		background: partnerColor,
		border: partnerColor,
	};
	return node;
}

export function relative(node: MyNode) {
	node = commonOptions(node);

	return node;
}

export function familyLink(node: MyNode) {
	node.familyLink = true;
	node = commonOptions(node);
	node.color = {
		background: '#ffffff',
	};
	node.widthConstraint = 1;

	node.borderWidth = 0;
	node.shapeProperties = { borderRadius: 90 };
	node.label = '';
	return node;
}

export function childConnector(node: MyNode) {
	node = commonOptions(node);
	node.opacity = 0;
	node.shapeProperties = { borderRadius: 90 };

	return node;
}
