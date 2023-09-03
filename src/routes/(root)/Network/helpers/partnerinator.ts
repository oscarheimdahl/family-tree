import type { Edge } from 'vis-network';

const HIDDEN = 'rgba(0,0,0,0)';
/**
 * Add relevant edges to partner
 *
 * Add edge between partner1 and partner2.
 * add edge between partner2 and partner1 children (hidden).
 * add edge between partner2 and partner1 parent (hidden).
 * @param from partner1, the one connected to the family tree by blood.
 * @param to partner2
 */
export function partnerinator(
	{ from, to }: { from: string; to: string },
	edges: Edge[],
	hierarchy: boolean
) {
	const newEdges: Edge[] = [];
	// Add partner 1
	newEdges.push({ from, to, length: 0.1, dashes: true, arrows: { to: false } });
	edges.forEach((node) => {
		if (node.from === from && node.to !== to)
			// Add partner1 children
			newEdges.push({
				from: to,
				to: node.to,
				color: { color: HIDDEN, highlight: HIDDEN, hover: 'rgba(100,100,100)' }
			});
		if (hierarchy) {
			// Add partner1 parent
			if (node.to === from)
				newEdges.push({
					from: node.from,
					to,
					hidden: true
				});
		}
	});
	return newEdges;
}
