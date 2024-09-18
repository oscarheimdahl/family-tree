'use client';

import { useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { connectionsAtom, relativesAtom } from '@/store/store';
import { ConnectionType, RelativeNodeType } from '@/types/types';

import { CanvasContainer } from './components/Canvas';
import { Connection } from './components/Connection';
import { NewConnectionLine } from './components/NewConnectionLine';
import { RelativeNode } from './components/RelativeNode';
import { SelectRect } from './components/SelectRect';
import { Tools } from './components/Tools';
import { Zoom } from './components/Zoom';

export const CanvasApp = ({
  serverRelatives,
  serverConnections,
}: {
  serverRelatives: RelativeNodeType[];
  serverConnections: ConnectionType[];
}) => {
  useHydrateAtoms([
    [relativesAtom, serverRelatives],
    [connectionsAtom, serverConnections],
  ]);
  const [connections] = useAtom(connectionsAtom);

  // return <ImageInput />;

  return (
    <div className="h-full w-full">
      <CanvasContainer>
        <NewConnectionLine />

        {connections.map((connection, i) => {
          return <Connection fromId={connection.source} toId={connection.target} key={i} />;
        })}
        <Relatives />
        <SelectRect />
      </CanvasContainer>
      {/* <Cursor /> */}
      <Tools />
      <Zoom />
    </div>
  );
};

export const Relatives = () => {
  const [relatives] = useAtom(relativesAtom);

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
      {relatives.map((relativeNode, i) => {
        return <RelativeNode key={i} relativeNode={relativeNode} />;
      })}
    </div>
  );
};
