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

let ls = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => null,
};
if (typeof window !== 'undefined') {
  //@ts-ignore
  ls = localStorage;
}

function tryParseStorage(key: string, defaultValue: any) {
  try {
    //@ts-ignore
    return JSON.parse(ls.getItem(key)) ?? defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
const storedRelatives = tryParseStorage('relatives', []) as RelativeNodeType[];
const storedConnections = tryParseStorage('connections', []) as ConnectionType[];
const storedZoom = parseFloat(ls.getItem('zoom') ?? '1');
const storedOffset = (JSON.parse(ls.getItem('offset')!) ?? {
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
