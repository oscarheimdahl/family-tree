import { atom } from 'jotai';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/app/(root)/components/Canvas';
import { connectionsData, relativesData } from '@/app/(root)/data';
import { ConnectionSource } from '@/types/types';

const canvasCenterWidth = -CANVAS_WIDTH / 2;
const canvasCenterHeight = -CANVAS_HEIGHT / 2;

export const mousePositionAtom = atom({ x: 0, y: 0 });
export const canvasOffsetAtom = atom({ x: canvasCenterWidth, y: canvasCenterHeight });
export const canvasZoomAtom = atom(1);
export const selectedToolAtom = atom<'add-connection' | 'edit' | undefined>();
export const newConnectionSourceAtom = atom<ConnectionSource | undefined>(undefined);
export const connectionsAtom = atom(connectionsData);
export const relativesAtom = atom(
  relativesData.map((relative) => ({
    ...relative,
    x: canvasCenterWidth * -1 + relative.x,
    y: canvasCenterHeight * -1 + relative.y,
  })),
);
export const draggedRelativeAtom = atom<string | undefined>(undefined);
