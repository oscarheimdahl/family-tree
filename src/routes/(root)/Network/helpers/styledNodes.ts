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
		background: partnerColor,
		border: partnerColor,
	};
	return node;
}

export function relative(node: MyNode) {
	node = commonOptions(node);
	node.widthConstraint = { minimum: 80, maximum: 80 };

	return node;
}

export function parentConnector(node: MyNode) {
	node = commonOptions(node);
	node.color = {
		background: '#ffffff',
	};
	node.widthConstraint = 1;

	node.borderWidth = 0;
	node.shapeProperties = { borderRadius: 90 };

	return node;
}

export function childConnector(node: MyNode) {
	node = commonOptions(node);
	node.opacity = 0;
	node.shapeProperties = { borderRadius: 90 };

	return node;
}
