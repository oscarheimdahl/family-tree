'use client';

import { useAtom } from 'jotai';

import { connectionsAtom, relativesAtom } from '@/store/store';

import { CanvasContainer } from './components/Canvas';
import { Connection } from './components/Connection';
import { NewConnectionLine } from './components/NewConnectionLine';
import { RelativeNode } from './components/RelativeNode';
import { Tools } from './components/Tools';

export default function Home() {
  const [connections] = useAtom(connectionsAtom);
  const [relatives] = useAtom(relativesAtom);

  return (
    <>
      <CanvasContainer>
        <NewConnectionLine />

        {connections.map((connection, i) => {
          return (
            <Connection
              fromId={connection.source}
              toId={connection.target}
              relativeNodes={relatives}
              key={i}
            />
          );
        })}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
          {relatives.map((relativeNode, i) => {
            return <RelativeNode key={i} relativeNode={relativeNode} />;
          })}
        </div>
      </CanvasContainer>
      <Tools />
    </>
  );
}
