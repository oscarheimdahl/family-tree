'use client';

import { ReactNode, useRef, WheelEvent, type MouseEvent } from 'react';

import { useAtom } from 'jotai';

import { useCanvasMousePosition } from '@/lib/hooks/useCanvasMousePosition';
import { useCanvasZoomOnPoint } from '@/lib/hooks/useCanvasZoomOnPoint';
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_ZOOM, MIN_ZOOM } from '@/lib/vars';
import { useUpdateRelative } from '@/store/hooks';
import {
  canvasOffsetAtom,
  canvasZoomAtom,
  draggedRelativeAtom,
  draggingCanvasAtom,
  newConnectionSourceAtom,
  pageMousePositionAtom,
  relativesAtom,
  selectedToolAtom,
  selectStartPositionAtom,
} from '@/store/store';

export const CanvasContainer = ({ children }: { children: ReactNode }) => {
  const [draggingCanvas, setDraggingCanvas] = useAtom(draggingCanvasAtom);
  const [, setCanvasOffset] = useAtom(canvasOffsetAtom);

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
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="h-full w-full overflow-hidden bg-gray-950">
      <Canvas>{children}</Canvas>
    </div>
  );
};

const Canvas = ({ children }: { children: ReactNode }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [offset] = useAtom(canvasOffsetAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);
  const updateRelative = useUpdateRelative();
  const [draggedRelative, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [pageMousePosition, setMousePosition] = useAtom(pageMousePositionAtom);
  const [, setSelectedTool] = useAtom(selectedToolAtom);
  const [, setNewConnectionSource] = useAtom(newConnectionSourceAtom);
  const [, setDraggingCanvas] = useAtom(draggingCanvasAtom);
  const [, setSelectStartPositionAtom] = useAtom(selectStartPositionAtom);
  const [relatives, setRelatives] = useAtom(relativesAtom);

  const canvasMousePosition = useCanvasMousePosition();
  const zoomOnPoint = useCanvasZoomOnPoint();

  const handleMouseUp = () => {
    setSelectStartPositionAtom(undefined);
    if (draggedRelative === undefined) return;

    relatives.forEach((relative) => {
      if (!relative.selected && draggedRelative !== relative.id) return;
      updateRelative(
        relative.id,
        (prevRelative) => ({
          x: snapToGrid(prevRelative.x),
          y: snapToGrid(prevRelative.y),
        }),
        { debounce: false },
      );
    });

    setDraggedRelative(undefined);
  };

  const canScroll = useRef(true);
  const handleScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (!canScroll.current) return;
    if (e.shiftKey) return;
    if (canvasRef.current === null) return;

    const delta = e.deltaY;
    const scaleAmount = 0.1;
    const newCanvasZoom = delta < 0 ? canvasZoom + scaleAmount : canvasZoom - scaleAmount;

    zoomOnPoint(newCanvasZoom, pageMousePosition);

    canScroll.current = false;
    setTimeout(() => {
      canScroll.current = true;
    }, 20);
  };

  const handleRelativeDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (draggedRelative === undefined) return;
    if (e.movementX === 0 && e.movementY === 0) return;
    e.stopPropagation();

    if (draggedRelative === undefined) return;

    relatives.forEach((relative) => {
      if (!relative.selected && draggedRelative !== relative.id) return;
      updateRelative(
        relative.id,
        (prevRelative) => ({
          x: clamp(0, prevRelative.x + e.movementX / canvasZoom, CANVAS_WIDTH),
          y: clamp(0, prevRelative.y + e.movementY / canvasZoom, CANVAS_HEIGHT),
        }),
        { debounce: false },
      );
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleRelativeDrag(e);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== canvasRef.current) return;

    setRelatives((prev) => prev.map((relative) => ({ ...relative, selected: false })));
    if (e.shiftKey) {
      setSelectStartPositionAtom({ x: canvasMousePosition.x, y: canvasMousePosition.y });
      return;
    }

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
      className="rounded-sm bg-slate-900 ring ring-[#ffffff]"
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
