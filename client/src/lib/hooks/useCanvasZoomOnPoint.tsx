import { useAtom } from 'jotai';

import { canvasOffsetAtom, canvasZoomAtom } from '@/store/store';

import { MAX_ZOOM, MIN_ZOOM } from '../vars';

export const useCanvasZoomOnPoint = () => {
  const [canvasOffset, setCanvasOffset] = useAtom(canvasOffsetAtom);
  const [canvasZoom, setCanvasZoom] = useAtom(canvasZoomAtom);

  return (_newCanvasZoom: number, centerPoint: { x: number; y: number }) => {
    const newCanvasZoom = clamp(MIN_ZOOM, _newCanvasZoom, MAX_ZOOM);
    if (newCanvasZoom === canvasZoom) return;
    setCanvasZoom(newCanvasZoom);

    // the same as useCanvasMousePosition but for the center point
    const centerPointCanvasPositionX = (centerPoint.x - canvasOffset.x) / canvasZoom;
    const centerPointCanvasPositionY = (centerPoint.y - canvasOffset.y) / canvasZoom;

    const newCanvasMousePositionX = (centerPoint.x - canvasOffset.x) / newCanvasZoom;
    const newCanvasMousePositionY = (centerPoint.y - canvasOffset.y) / newCanvasZoom;
    const canvasMousePositionDriftX = newCanvasMousePositionX - centerPointCanvasPositionX;
    const canvasMousePositionDriftY = newCanvasMousePositionY - centerPointCanvasPositionY;

    setCanvasOffset((prev) => ({
      x: prev.x + canvasMousePositionDriftX * newCanvasZoom,
      y: prev.y + canvasMousePositionDriftY * newCanvasZoom,
    }));
  };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
