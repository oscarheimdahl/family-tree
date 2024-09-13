import { useAtom } from 'jotai';

import { cn } from '@/lib/utils';
import { selectedToolAtom } from '@/store/store';

export const Line = ({
  x1,
  y1,
  x2,
  y2,
  onClick,
  hoverStyle,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick?: () => void;
  hoverStyle?: 'delete' | 'connect';
}) => {
  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <g className="group">
        {/* hover outline */}
        <line
          className={cn(
            'stroke-transparent',
            hoverStyle === 'connect' && 'ring group-hover:stroke-white',
            hoverStyle === 'delete' && 'group-hover:stroke-black',
          )}
          strokeDasharray={hoverStyle === 'delete' ? '5' : ''}
          strokeWidth={12}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
        {/* visual line */}
        <line
          className={cn('stroke-rose-700', hoverStyle === 'delete' && 'group-hover:stroke-slate-700')}
          strokeLinecap="round"
          strokeWidth={5}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
        {/* pointer capture */}
        <line
          className={cn('pointer-events-auto', 'cursor-pointer')}
          onClick={onClick}
          stroke={'transparent'}
          strokeWidth={25}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
      </g>
    </svg>
  );
};
