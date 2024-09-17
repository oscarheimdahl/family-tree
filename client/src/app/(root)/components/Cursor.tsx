import { useAtom } from 'jotai';

import { useCanvasMousePosition } from '@/lib/hooks/useCanvasMousePosition';
import { canvasOffsetAtom, canvasZoomAtom, pageMousePositionAtom } from '@/store/store';

function roundNumberTo2Decimals(number: number) {
  return Math.round(number * 100) / 100;
}

export const Cursor = () => {
  const [offset] = useAtom(canvasOffsetAtom);
  const [zoom] = useAtom(canvasZoomAtom);
  const [pageMousePosition] = useAtom(pageMousePositionAtom);
  const canvasMousePosition = useCanvasMousePosition();

  return (
    <div className="absolute bottom-0 flex flex-col text-white">
      <div>
        PageMousePos: {roundNumberTo2Decimals(pageMousePosition.x)}, {roundNumberTo2Decimals(pageMousePosition.y)}
      </div>
      <div>
        CanvasMousePos: {roundNumberTo2Decimals(canvasMousePosition.x)}, {roundNumberTo2Decimals(canvasMousePosition.y)}
      </div>
      <div>
        Offset: {roundNumberTo2Decimals(offset.x)}, {roundNumberTo2Decimals(offset.y)}
      </div>
      <div>Zoom: {roundNumberTo2Decimals(zoom)}</div>
    </div>
  );
};
