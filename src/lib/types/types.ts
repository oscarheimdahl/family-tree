import type { Node } from 'vis-network';

export interface MyNode extends Node {
	partner?: boolean;
	parentsId?: string;
	relationshipId?: string;
	familyLink?: boolean;
}

export interface Relative {
	id: string;
	firstname: string | null;
	lastname: string | null;
	childof: string | null;
	partnerto: string | null;
	description: string | null;
	birthyear?: number | null;
	generation?: number | null;
	image?: string | null;
}
