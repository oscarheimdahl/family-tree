import type { Options } from 'vis-network';

export const networkOptions: Options = {
	configure: true,
	layout: {
		randomSeed: 1,
		hierarchical: {
			enabled: true,
			direction: 'UD',
			sortMethod: 'hubsize'
		}
	},
	interaction: {
		hover: true,
		selectable: true
	},
	physics: {
		hierarchicalRepulsion: {
			avoidOverlap: 1
		},
		barnesHut: {
			damping: 0.75,
			avoidOverlap: 0.34
		},
		repulsion: {
			centralGravity: 1,
			springLength: 2000
		}
	},
	nodes: {
		shape: 'box',
		// mass: 1,
		color: {
			border: 'black',
			background: 'black'
		},
		font: {
			color: 'white'
		}
	},
	edges: {}
};
