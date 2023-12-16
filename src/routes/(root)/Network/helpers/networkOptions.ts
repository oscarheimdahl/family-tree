import type { Options } from 'vis-network';
const relativeColor = '#D64933';
export const partnerColor = '#DD962C';

export const networkOptions: Options = {
	// // configure: true,
	layout: {
		randomSeed: 1,
		// hierarchical: {
		// 	enabled: true,
		// 	direction: 'UD',
		// 	sortMethod: 'hubsize'
		// }
	},
	interaction: {
		hover: false,
		// selectable: false,
		dragNodes: false,
	},
	physics: {
		enabled: false,
		// hierarchicalRepulsion: {
		// 	avoidOverlap: 1
		// },
		// barnesHut: {
		// 	damping: 0.75,
		// 	avoidOverlap: 0.34
		// },
		// repulsion: {
		// 	centralGravity: 1
		// 	// springLength:
		// }
	},
	nodes: {
		widthConstraint: {
			minimum: 100,
			maximum: 100,
		},
		shape: 'box',
		shadow: {
			color: '#00000066',
			x: 0,
			size: 20,
		},
		font: {
			color: 'white',
			size: 20,
		},
		color: {
			background: relativeColor,
			highlight: {
				border: 'white',
				background: relativeColor,
			},
			hover: relativeColor,
			border: relativeColor,
		},
		// borderWidth: 10,
		shapeProperties: { borderRadius: 3 },
		physics: false,
	},
	edges: {
		length: 1,
		color: '#ffffff',
		// arrows: { to: { scaleFactor: 0.8, type: 'arrow', enabled: true } },
		arrowStrikethrough: false,
	},
};
