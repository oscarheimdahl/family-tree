import { useAtom, useAtomValue } from 'jotai';

import { useFinalizeConnection } from '@/store/hooks';
import { newConnectionSourceAtom, relativesAtom, selectedToolAtom } from '@/store/store';
import { ConnectionSource, RelativeNodeType } from '@/types/types';

import { Line } from './Line';

export const Connection = ({ fromId, toId }: { fromId: ConnectionSource; toId: string }) => {
  const [newConnectionSource, setNewConnectionSource] = useAtom(newConnectionSourceAtom);
  const [relativeNodes] = useAtom(relativesAtom);
  const selectedTool = useAtomValue(selectedToolAtom);
  const finalizeConnection = useFinalizeConnection();

  const coupleConnection = typeof fromId === 'string';
  if (coupleConnection) {
    const from = relativeNodes.find((node) => node.id === fromId);
    const to = relativeNodes.find((node) => node.id === toId);

    if (!from || !to) return null;

    return (
      <Line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        onClick={
          selectedTool === 'add-connection'
            ? () => {
                if (newConnectionSource === undefined) setNewConnectionSource({ parent1: from.id, parent2: to.id });
                else if (
                  // If same id as set below, we cancel
                  typeof newConnectionSource !== 'string' &&
                  newConnectionSource?.parent1 === from.id &&
                  newConnectionSource?.parent2 === to.id
                )
                  setNewConnectionSource(undefined);
                else {
                  finalizeConnection({ parent1: from.id, parent2: to.id });
                }
              }
            : undefined
        }
      />
    );
  }

  const parent1 = relativeNodes.find((node) => node.id === fromId.parent1);
  const parent2 = relativeNodes.find((node) => node.id === fromId.parent2);
  const to = relativeNodes.find((node) => node.id === toId);

  if (!parent1 || !parent2 || !to) return null;

  const from = {
    x: (parent1.x + parent2.x) / 2,
    y: (parent1.y + parent2.y) / 2,
  };

  return <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
};
