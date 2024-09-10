'use client';

import React, { ReactNode, useRef, useState, type MouseEvent } from 'react';

import { useAtom } from 'jotai';

import {
  canvasOffsetAtom,
  connectionsAtom,
  draggedRelativeAtom,
  mousePositionAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';

export const CanvasContainer = ({ children }: { children: ReactNode }) => {
  const [canDrag, setCanDrag] = useState(false);
  const [offset, setOffset] = useAtom(canvasOffsetAtom);

  const handleCanvasMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setCanDrag(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canDrag) return;
    setOffset((prev) => {
      return {
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      };
    });
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    setCanDrag(false);
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="h-full w-full bg-gray-700">
      <Canvas offset={offset} onMouseDown={handleCanvasMouseDown}>
        {children}
      </Canvas>
    </div>
  );
};

const Canvas = ({
  children,
  onMouseDown,
  offset,
}: {
  children: ReactNode;
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  offset: { x: number; y: number };
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, setRelatives] = useAtom(relativesAtom);
  const [draggedRelative, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [, setMousePosition] = useAtom(mousePositionAtom);
  const [, setSelectedTool] = useAtom(selectedToolAtom);

  const handleMouseUp = () => {
    setDraggedRelative(undefined);

    setRelatives((prev) => {
      return prev.map((relative) => {
        return {
          ...relative,
          x: snapToGrid(relative.x, 10),
          y: snapToGrid(relative.y, 10),
        };
      });
    });
  };

  const handleRelativeDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (draggedRelative === undefined) return;
    if (e.movementX === 0 && e.movementY === 0) return;
    e.stopPropagation();

    setRelatives((prev) => {
      return prev.map((relative) => {
        if (relative.id === draggedRelative) {
          return {
            ...relative,
            x: clamp(0, relative.x + e.movementX, window.innerWidth),
            y: clamp(0, relative.y + e.movementY, window.innerHeight),
          };
        }
        return relative;
      });
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleRelativeDrag(e);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={canvasRef}
      onClick={(e) => {
        if (e.target !== canvasRef.current) return;
        return setSelectedTool(undefined);
      }}
      onMouseDown={onMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        width: '2000px',
        height: '2000px',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      {children}
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function snapToGrid(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize;
}
