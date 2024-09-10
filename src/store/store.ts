// prettier-ignore

import { atom } from 'jotai';

import { connectionsData, relativesData } from '@/app/(root)/data';
import { ConnectionSource } from '@/types/types';

export const mousePositionAtom = atom({ x: 0, y: 0 });
export const canvasOffsetAtom = atom({ x: 0, y: 0 });
export const selectedToolAtom = atom<'add-connection' | 'edit' | undefined>();
export const newConnectionSourceAtom = atom<ConnectionSource | undefined>(undefined);
export const connectionsAtom = atom(connectionsData);
export const relativesAtom = atom(relativesData);
export const draggedRelativeAtom = atom<string | undefined>(undefined);
