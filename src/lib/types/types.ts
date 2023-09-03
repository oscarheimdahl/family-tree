import type { Node } from 'vis-network';

export interface MyNode extends Node {
	partner?: boolean;
}

export interface Relative {
	id: string;
	firstname: string;
	lastname: string;
	childof: string;
	partnerto: string;
	description: string;
	birthyear?: number;
	generation?: number;
}
