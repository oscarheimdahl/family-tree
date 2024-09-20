import { useAtom, useAtomValue } from 'jotai';

import { deleteConnectionBackend } from '@/apiRoutes/connections';
import { connectionsIdentical, connectionSourceOnConnection } from '@/lib/utils';
import { useFinalizeConnection, withOnErrorToast } from '@/store/hooks';
import { connectionsAtom, newConnectionSourceAtom, relativesAtom, selectedToolAtom } from '@/store/store';
import { ConnectionSource } from '@/types/types';

import { Line } from './Line';

export const Connection = ({ fromId, toId }: { fromId: ConnectionSource; toId: string }) => {
  const [newConnectionSource, setNewConnectionSource] = useAtom(newConnectionSourceAtom);
  const [, setConnections] = useAtom(connectionsAtom);
  const [relativeNodes] = useAtom(relativesAtom);
  const selectedTool = useAtomValue(selectedToolAtom);
  const finalizeConnection = useFinalizeConnection();

  let hoverStyle: 'connect' | 'delete' | undefined = undefined;
  let onClick = undefined;

  const getMidPoint = (point1: { x: number; y: number }, point2: { x: number; y: number }) => ({
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  });

  if (selectedTool === 'edit') {
    hoverStyle = 'delete';

    onClick = () => {
      setConnections((prev) => {
        return prev.filter((connection) => {
          const keep =
            !connectionsIdentical(connection, { source: fromId, target: toId, id: 'null' }) &&
            !connectionSourceOnConnection(connection, { parent1: fromId, parent2: toId });

          if (!keep) {
            withOnErrorToast(deleteConnectionBackend)(connection.id);
          }

          return keep;
        });
      });
    };
  }

  const coupleConnection = typeof fromId === 'string';
  if (coupleConnection) {
    const from = relativeNodes.find((node) => node.id === fromId);
    const to = relativeNodes.find((node) => node.id === toId);

    if (!from || !to) return null;

    if (selectedTool === 'add-connection') {
      hoverStyle = 'connect';
      onClick = () => {
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
      };
    }

    const midPoint = getMidPoint(to, from);

    return (
      <>
        <Line hoverStyle={hoverStyle} x1={from.x} y1={from.y} x2={midPoint.x} y2={midPoint.y} onClick={onClick} />
        <Line
          // className="stroke-orange-300"
          hoverStyle={hoverStyle}
          x1={midPoint.x}
          y1={midPoint.y}
          x2={to.x}
          y2={to.y}
          onClick={onClick}
        />
      </>
    );
  }

  const parent1 = relativeNodes.find((node) => node.id === fromId.parent1);
  const parent2 = relativeNodes.find((node) => node.id === fromId.parent2);
  const to = relativeNodes.find((node) => node.id === toId);

  if (!parent1 || !parent2 || !to) return null;

  const midPoint = getMidPoint(parent1, parent2);

  return (
    <>
      <Line onClick={onClick} hoverStyle={hoverStyle} x1={midPoint.x} y1={midPoint.y} x2={to.x} y2={to.y} />
    </>
  );
};
