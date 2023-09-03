import type { Options } from 'vis-network';
const relativeColor = '#0588D1';
const partnerColor = '#3D3D52';

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
			color: 'black'
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

export const partnerColors = {
	background: partnerColor,
	highlight: partnerColor,
	hover: partnerColor,
	border: partnerColor
};
