import { useEffect } from 'react';

import { useAtom } from 'jotai';

import {
  canvasOffsetAtom,
  mousePositionAtom,
  newConnectionSourceAtom,
  relativesAtom,
} from '@/store/store';

import { Line } from './Line';

export const NewConnectionLine = () => {
  const [newConnectionSource, setNewConnectionSource] = useAtom(
    newConnectionSourceAtom,
  );
  const [relatives] = useAtom(relativesAtom);
  const [offset] = useAtom(canvasOffsetAtom);
  const [mousePosition] = useAtom(mousePositionAtom);

  useEffect(() => {
    const removeLine = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNewConnectionSource(undefined);
      }
    };
    document.addEventListener('keydown', removeLine);
    return () => document.removeEventListener('keydown', removeLine);
  }, []);

  if (typeof newConnectionSource === 'string') {
    const sourceRelative = relatives.find(
      (node) => node.id === newConnectionSource,
    );

    if (!sourceRelative) return null;

    return (
      <Line
        x1={sourceRelative.x}
        y1={sourceRelative.y}
        x2={mousePosition.x - offset.x}
        y2={mousePosition.y - offset.y}
      />
    );
  }

  const sourceParent1 = relatives.find(
    (node) => node.id === newConnectionSource?.parent1,
  );

  const sourceParent2 = relatives.find(
    (node) => node.id === newConnectionSource?.parent2,
  );

  if (!sourceParent1 || !sourceParent2) return null;

  return (
    <Line
      x1={(sourceParent1.x + sourceParent2.x) / 2}
      y1={(sourceParent1.y + sourceParent2.y) / 2}
      x2={mousePosition.x}
      y2={mousePosition.y}
    />
  );
};
