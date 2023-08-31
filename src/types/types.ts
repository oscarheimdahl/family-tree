import type { Node } from 'vis-network';

export interface MyNode extends Node {
	partner?: boolean;
}
