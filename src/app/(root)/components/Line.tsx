import { cn } from '@/lib/utils';

export const Line = ({
  x1,
  y1,
  x2,
  y2,
  onClick,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick?: () => void;
}) => {
  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <g className="group">
        <line
          className={cn('stroke-black', onClick && 'group-hover:stroke-white')}
          strokeWidth={3}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        ></line>
        <line
          className={cn(
            'pointer-events-auto',
            onClick && 'cursor-pointer hover:opacity-50',
          )}
          onClick={onClick}
          stroke={'transparent'}
          strokeWidth={25}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        ></line>
      </g>
    </svg>
  );
};
