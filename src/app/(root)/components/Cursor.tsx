import { useAtom } from 'jotai';

import { canvasOffsetAtom, canvasZoomAtom, mousePositionAtom } from '@/store/store';

function roundNumberTo2Decimals(number: number) {
  return Math.round(number * 100) / 100;
}

export const Cursor = () => {
  const [mousePosition] = useAtom(mousePositionAtom);
  const [offset] = useAtom(canvasOffsetAtom);
  const [zoom] = useAtom(canvasZoomAtom);

  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <text x={mousePosition.x + 20} y={mousePosition.y} fill="white" fontSize={20}>
        {roundNumberTo2Decimals(mousePosition.x)}, {roundNumberTo2Decimals(mousePosition.y)}
      </text>
      <text x={mousePosition.x + 20} y={mousePosition.y + 20} fill="white" fontSize={20}>
        {roundNumberTo2Decimals(offset.x)}, {roundNumberTo2Decimals(offset.y)}
      </text>
      <text x={mousePosition.x + 20} y={mousePosition.y + 40} fill="white" fontSize={20}>
        {roundNumberTo2Decimals(zoom)}
      </text>
    </svg>
  );
};
