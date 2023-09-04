import type { Options } from 'vis-network';
const relativeColor = '#D64933';
export const partnerColor = '#DD962C';

export const networkOptions: Options = {
	// configure: true,
	layout: {
		randomSeed: 2,
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
		shadow: {
			color: '#00000066',
			x: 0,
			size: 20
		},
		font: {
			color: 'white'
		},
		color: {
			background: relativeColor,
			highlight: relativeColor,
			hover: relativeColor,
			border: relativeColor
		},
		borderWidth: 10,
		shapeProperties: { borderRadius: 1 }
	},
	edges: {
		color: '#ccc',
		arrows: { to: { scaleFactor: 0.8, type: 'arrow', enabled: true } },
		arrowStrikethrough: false
	}
};
