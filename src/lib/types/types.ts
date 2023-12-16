import type { Node } from 'vis-network';

export interface MyNode extends Node {
	partner?: boolean;
	parentsId?: string;
	relationshipId?: string;
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
	image?: string;
}
