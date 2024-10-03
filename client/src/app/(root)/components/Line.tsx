import { cn } from '@/lib/utils';

export const Line = ({
  x1,
  y1,
  x2,
  y2,
  onClick,
  hoverStyle,
  className,
  curve,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick?: () => void;
  hoverStyle?: 'delete' | 'connect';
  className?: string;
  curve?: boolean;
}) => {
  const lineWidth = 12;
  const childBelow = y2 > y1;
  const direction = childBelow ? 1 : -1;
  const lineColor = 'stroke-slate-800';

  const firstBezierStopX = x1;
  const firstBezierStopY = y1 + 400 * direction;
  const secondBezierStopX = x2;
  const secondBezierStopY = y2 - 400 * direction;

  const path = `M ${x1} ${y1 + 100 * direction} C ${firstBezierStopX} ${firstBezierStopY}, ${secondBezierStopX} ${secondBezierStopY}, ${x2} ${y2}`;

  const anchorLineEnd = y1 + 100 * direction;

  if (curve)
    return (
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <g className="group">
          {/* Anchor line */}
          <line
            className={cn(lineColor, hoverStyle === 'delete' && 'group-hover:stroke-slate-700', className)}
            strokeLinecap="round"
            strokeWidth={lineWidth}
            x1={x1}
            y1={y1}
            x2={x1}
            y2={anchorLineEnd}
          />
          {/* hover outline */}
          <path
            className={cn('stroke-transparent', hoverStyle === 'delete' && 'group-hover:stroke-white')}
            strokeDasharray={hoverStyle === 'delete' ? '5' : ''}
            fill="transparent"
            stroke="red"
            strokeWidth={12}
            d={path}
          />
          {/* visual line */}

          <path
            className={cn(lineColor, hoverStyle === 'delete' && 'group-hover:stroke-transparent', className)}
            strokeLinecap="square"
            strokeWidth={lineWidth}
            d={path}
            stroke="black"
            fill="transparent"
          />
          {/* pointer capture */}
          <path
            fill="transparent"
            className={cn('pointer-events-auto', 'cursor-pointer')}
            onClick={onClick}
            stroke={'transparent'}
            strokeWidth={25}
            d={path}
          />
        </g>
      </svg>
    );
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
          className={cn(lineColor, hoverStyle === 'delete' && 'group-hover:stroke-transparent', className)}
          strokeLinecap="round"
          strokeWidth={lineWidth}
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
