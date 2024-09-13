import { atom } from 'jotai';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/app/(root)/data';
import { ConnectionSource, ConnectionType, RelativeNodeType } from '@/types/types';

const canvasCenterWidth = -CANVAS_WIDTH / 2;
const canvasCenterHeight = -CANVAS_HEIGHT / 2;

// const movedRelatives = relativesData.map((relative) => ({
//   ...relative,
//   x: canvasCenterWidth * -1 + relative.x,
//   y: canvasCenterHeight * -1 + relative.y,
// }));

const storedRelatives = JSON.parse(localStorage.getItem('relatives')! ?? []) as RelativeNodeType[];
const storedConnections = JSON.parse(localStorage.getItem('connections')! ?? []) as ConnectionType[];
const storedZoom = parseFloat(localStorage.getItem('zoom') ?? '1');
const storedOffset = (JSON.parse(localStorage.getItem('offset')!) ?? {
  x: canvasCenterWidth,
  y: canvasCenterHeight,
}) as { x: number; y: number };

export const pageMousePositionAtom = atom({ x: 0, y: 0 });
export const canvasTransformOriginAtom = atom({ x: 0, y: 0 });
export const canvasOffsetAtom = atom(storedOffset);
export const canvasZoomAtom = atom(storedZoom);
export const selectedToolAtom = atom<'add-connection' | 'edit' | undefined>();
export const newConnectionSourceAtom = atom<ConnectionSource | undefined>(undefined);
export const connectionsAtom = atom(storedConnections);
export const relativesAtom = atom(storedRelatives);
export const draggedRelativeAtom = atom<string | undefined>(undefined);
export const draggingCanvasAtom = atom(false);
