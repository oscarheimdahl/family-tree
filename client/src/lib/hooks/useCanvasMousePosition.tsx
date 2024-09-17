import { useAtom } from 'jotai';

import { canvasOffsetAtom, canvasZoomAtom, pageMousePositionAtom } from '@/store/store';

export const useCanvasMousePosition = () => {
  const [pageMousePosition] = useAtom(pageMousePositionAtom);
  const [canvasOffset] = useAtom(canvasOffsetAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);

  return {
    x: (pageMousePosition.x - canvasOffset.x) / canvasZoom,
    y: (pageMousePosition.y - canvasOffset.y) / canvasZoom,
  };
};
