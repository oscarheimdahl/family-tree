'use client';

import { ReactNode, useRef, WheelEvent, type MouseEvent } from 'react';

import { useAtom } from 'jotai';

import {
  canvasOffsetAtom,
  canvasZoomAtom,
  draggedRelativeAtom,
  draggingCanvasAtom,
  newConnectionSourceAtom,
  pageMousePositionAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../data';

export const useCanvasMousePosition = () => {
  const [pageMousePosition] = useAtom(pageMousePositionAtom);
  const [canvasOffset] = useAtom(canvasOffsetAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);

  return {
    x: (pageMousePosition.x - canvasOffset.x) / canvasZoom,
    y: (pageMousePosition.y - canvasOffset.y) / canvasZoom,
  };
};

export const CanvasContainer = ({ children }: { children: ReactNode }) => {
  const [draggingCanvas, setDraggingCanvas] = useAtom(draggingCanvasAtom);
  const [, setCanvasOffset] = useAtom(canvasOffsetAtom);

  const handleCanvasMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setDraggingCanvas(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingCanvas) return;
    setCanvasOffset((prev) => {
      return {
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      };
    });
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    setDraggingCanvas(false);
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="h-full w-full overflow-hidden">
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
  const canvasRef = useRef<HTMLDivElement>(null);

  const [offset] = useAtom(canvasOffsetAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);
  const [, setRelatives] = useAtom(relativesAtom);
  const [draggedRelative, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [pageMousePosition, setMousePosition] = useAtom(pageMousePositionAtom);
  const [, setSelectedTool] = useAtom(selectedToolAtom);
  const [, setNewConnectionSource] = useAtom(newConnectionSourceAtom);
  const [canvasOffset, setCanvasOffset] = useAtom(canvasOffsetAtom);
  const [, setCanvasZoom] = useAtom(canvasZoomAtom);
  const [, setDraggingCanvas] = useAtom(draggingCanvasAtom);

  const canvasMousePosition = useCanvasMousePosition();

  const handleMouseUp = () => {
    setDraggedRelative(undefined);

    setRelatives((prev) => {
      return prev.map((relative) => {
        return {
          ...relative,
          x: snapToGrid(relative.x),
          y: snapToGrid(relative.y),
        };
      });
    });
  };

  const canScroll = useRef(true);
  const handleScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (!canScroll.current) return;
    const delta = e.deltaY;

    if (canvasRef.current === null) return;

    const scaleAmount = 0.1;
    const _newCanvasZoom = delta < 0 ? canvasZoom + scaleAmount : canvasZoom - scaleAmount;
    const newCanvasZoom = clamp(0.25, _newCanvasZoom, 2);

    if (newCanvasZoom === canvasZoom) return;

    setCanvasZoom(newCanvasZoom);

    const newCanvasMousePositionX = (pageMousePosition.x - canvasOffset.x) / newCanvasZoom;
    const newCanvasMousePositionY = (pageMousePosition.y - canvasOffset.y) / newCanvasZoom;
    const canvasMousePositionDriftX = newCanvasMousePositionX - canvasMousePosition.x;
    const canvasMousePositionDriftY = newCanvasMousePositionY - canvasMousePosition.y;

    setCanvasOffset((prev) => ({
      x: prev.x + canvasMousePositionDriftX * newCanvasZoom,
      y: prev.y + canvasMousePositionDriftY * newCanvasZoom,
    }));
    canScroll.current = false;
    setTimeout(() => {
      canScroll.current = true;
    }, 20);
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
            x: clamp(0, relative.x + e.movementX / canvasZoom, CANVAS_WIDTH),
            y: clamp(0, relative.y + e.movementY / canvasZoom, CANVAS_HEIGHT),
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

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    onMouseDown(e);
    if (e.target !== canvasRef.current) return;

    setDraggingCanvas(true);
    setSelectedTool(undefined);
    setNewConnectionSource(undefined);
  };

  return (
    <div
      onWheel={handleScroll}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="rounded-sm bg-transparent ring ring-[#ffffff11]"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${canvasZoom})`,
        transformOrigin: '0 0',
        backgroundSize: '100px 100px',
        backgroundImage: `linear-gradient(to right, #ffffff11 1px, transparent 1px),
          linear-gradient(to bottom, #ffffff11 1px, transparent 1px)`,
      }}
    >
      {children}
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function snapToGrid(value: number) {
  const gridSize = 50;
  return Math.round(value / gridSize) * gridSize;
}
