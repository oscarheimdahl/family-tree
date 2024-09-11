'use client';

import { ReactNode, useRef, useState, WheelEvent, type MouseEvent } from 'react';

import { useAtom } from 'jotai';

import {
  canvasOffsetAtom,
  canvasZoomAtom,
  draggedRelativeAtom,
  mousePositionAtom,
  newConnectionSourceAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';

export const CANVAS_WIDTH = 5000;
export const CANVAS_HEIGHT = 5000;

export const CanvasContainer = ({ children }: { children: ReactNode }) => {
  const [canDrag, setCanDrag] = useState(false);
  const [, setOffset] = useAtom(canvasOffsetAtom);
  const [, setZoom] = useAtom(canvasZoomAtom);

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

  const handleScroll = (e: WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaY;

    if (Math.abs(delta) < 10) return;
    if (delta < 0)
      setZoom((prev) => {
        const newZoom = prev + 0.1;
        return Math.min(newZoom, 2);
      });
    else
      setZoom((prev) => {
        const newZoom = prev - 0.1;
        return Math.max(newZoom, 0.4);
      });
  };

  return (
    <div
      onWheel={handleScroll}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="h-full w-full overflow-hidden bg-gray-700"
    >
      <Canvas onMouseDown={handleCanvasMouseDown}>{children}</Canvas>
    </div>
  );
};

const Canvas = ({
  children,
  onMouseDown,
}: {
  children: ReactNode;
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
}) => {
  const [offset] = useAtom(canvasOffsetAtom);
  const [zoom] = useAtom(canvasZoomAtom);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [, setRelatives] = useAtom(relativesAtom);
  const [draggedRelative, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [, setMousePosition] = useAtom(mousePositionAtom);
  const [, setSelectedTool] = useAtom(selectedToolAtom);
  const [, setNewConnectionSource] = useAtom(newConnectionSourceAtom);

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
            x: clamp(0, relative.x + e.movementX / zoom, CANVAS_WIDTH),
            y: clamp(0, relative.y + e.movementY / zoom, CANVAS_HEIGHT),
          };
        }
        return relative;
      });
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleRelativeDrag(e);
    setMousePosition({ x: e.clientX / zoom - offset.x / zoom, y: e.clientY / zoom - offset.y / zoom });
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== canvasRef.current) return;
    setSelectedTool(undefined);
    setNewConnectionSource(undefined);
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: 'top left',
      }}
      className="rounded-sm ring ring-gray-500"
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
