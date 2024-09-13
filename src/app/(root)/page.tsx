'use client';

import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { canvasOffsetAtom, canvasZoomAtom, connectionsAtom, relativesAtom } from '@/store/store';

import { CanvasContainer } from './components/Canvas';
import { Connection } from './components/Connection';
import { Cursor } from './components/Cursor';
import { NewConnectionLine } from './components/NewConnectionLine';
import { RelativeNode } from './components/RelativeNode';
import { Tools } from './components/Tools';

export default function Home() {
  const [connections] = useAtom(connectionsAtom);
  const [relatives] = useAtom(relativesAtom);
  const [canvasOffset] = useAtom(canvasOffsetAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);

  useEffect(() => {
    localStorage.setItem('relatives', JSON.stringify(relatives));
  }, [relatives]);

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('offset', JSON.stringify(canvasOffset));
  }, [canvasOffset]);

  useEffect(() => {
    localStorage.setItem('zoom', JSON.stringify(canvasZoom));
  }, [canvasZoom]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 to-gray-900">
      <CanvasContainer>
        <NewConnectionLine />

        {connections.map((connection, i) => {
          return <Connection fromId={connection.source} toId={connection.target} key={i} />;
        })}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
          {relatives.map((relativeNode, i) => {
            return <RelativeNode key={i} relativeNode={relativeNode} />;
          })}
        </div>
      </CanvasContainer>
      <Cursor />
      <Tools />
    </div>
  );
}
