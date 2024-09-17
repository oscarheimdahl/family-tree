import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { pageMousePositionAtom, relativesAtom, selectStartPositionAtom } from '@/store/store';

import { useCanvasMousePosition } from './Canvas';

export const SelectRect = () => {
  const mousePosition = useCanvasMousePosition();
  const [selectStartPosition] = useAtom(selectStartPositionAtom);
  useIsInSelect();

  if (!selectStartPosition) return null;

  const right = mousePosition.x - selectStartPosition.x < 0;
  const top = mousePosition.y - selectStartPosition.y < 0;
  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <rect
        fill="transparent"
        stroke="#ffffffaa"
        strokeDasharray={'5 10'}
        strokeWidth={1}
        x={right ? mousePosition.x : selectStartPosition.x}
        y={top ? mousePosition.y : selectStartPosition.y}
        width={right ? selectStartPosition.x - mousePosition.x : mousePosition.x - selectStartPosition.x}
        height={top ? selectStartPosition.y - mousePosition.y : mousePosition.y - selectStartPosition.y}
        // height={mousePosition.y - selectStartPosition.y}
      ></rect>
    </svg>
  );
};

export const useIsInSelect = () => {
  const mousePosition = useCanvasMousePosition();
  const [selectStartPosition] = useAtom(selectStartPositionAtom);
  const [relatives, setRelatives] = useAtom(relativesAtom);

  useEffect(() => {
    if (!selectStartPosition) return;

    const minX = Math.min(mousePosition.x, selectStartPosition.x);
    const maxX = Math.max(mousePosition.x, selectStartPosition.x);
    const minY = Math.min(mousePosition.y, selectStartPosition.y);
    const maxY = Math.max(mousePosition.y, selectStartPosition.y);

    const selectedRelatives = relatives.filter((relative) => {
      return relative.x >= minX && relative.x <= maxX && relative.y >= minY && relative.y <= maxY;
    });

    // Avoid unnecessary state updates by checking if anything actually changes
    const hasSelectionChanged = relatives.some((relative) => {
      const isSelected = selectedRelatives.includes(relative);
      return relative.selected !== isSelected;
    });

    if (hasSelectionChanged) {
      setRelatives((prev) =>
        prev.map((relative) => {
          const isSelected = selectedRelatives.includes(relative);
          return {
            ...relative,
            selected: isSelected,
          };
        }),
      );
    }
  }, [mousePosition, selectStartPosition, relatives, setRelatives]);
};
