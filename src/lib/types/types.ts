import type { Node } from 'vis-network';

export interface MyNode extends Node {
	partner?: boolean;
}

export interface Relative {
	id: string;
	firstname: string;
	lastname: string;
	childOf: string;
	partnerTo: string;
	description: string;
}
