import { atom } from 'jotai';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/vars';
import { ConnectionSource, ConnectionType, RelativeNodeType } from '@/types/types';

const canvasCenterWidth = -CANVAS_WIDTH / 2;
const canvasCenterHeight = -CANVAS_HEIGHT / 2;

export const pageMousePositionAtom = atom({ x: 0, y: 0 });
export const selectStartPositionAtom = atom<{ x: number; y: number } | undefined>(undefined);
export const canvasTransformOriginAtom = atom({ x: 0, y: 0 });
export const canvasOffsetAtom = atom({ x: canvasCenterWidth, y: canvasCenterHeight });
export const canvasZoomAtom = atom(1);
export const selectedToolAtom = atom<'add-connection' | 'edit' | undefined>();
export const newConnectionSourceAtom = atom<ConnectionSource | undefined>(undefined);
export const connectionsAtom = atom<ConnectionType[]>([]);
export const relativesAtom = atom<RelativeNodeType[]>([]);
export const draggedRelativeAtom = atom<string | undefined>(undefined);
export const draggingCanvasAtom = atom(false);
export const hoveredRelativeAtom = atom<string | undefined>(undefined);
export const hideHoveredRelativeTimeoutRefAtom = atom<NodeJS.Timeout | undefined>(undefined);
