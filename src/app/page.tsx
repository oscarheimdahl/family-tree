'use client';

import { useEffect, useState, type MouseEvent } from 'react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CARD_WIDTH = 160;

type RelativeNode = {
  id: string;
  x: number;
  y: number;
  name: string;
  description?: string;
};

type Connection = {
  source: string | { parent1: string; parent2: string };
  target: string;
};

const relativesData: RelativeNode[] = [
  {
    id: crypto.randomUUID(),
    x: 100,
    y: 100,
    name: 'Oscar',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 400,
    y: 100,
    name: 'Tove',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 250,
    y: 300,
    name: 'Baby',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 100,
    y: 100,
    name: 'Johan',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 100,
    y: 100,
    name: 'Ingela',
    description: 'He is a great guy',
  },
];

const connectionsData: Connection[] = [
  {
    source: relativesData[0].id,
    target: relativesData[1].id,
  },
  {
    source: { parent1: relativesData[0].id, parent2: relativesData[1].id },
    target: relativesData[2].id,
  },
  {
    source: relativesData[3].id,
    target: relativesData[4].id,
  },
  {
    source: { parent1: relativesData[3].id, parent2: relativesData[4].id },
    target: relativesData[0].id,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [relatives, setRelatives] = useState(relativesData);
  const [draggedRelative, setDraggedRelative] = useState<string>();

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, id: string) => {
    setDraggedRelative(id);
  };
  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    setDraggedRelative(undefined);
  };
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setRelatives((prev) => {
      return prev.map((relative) => {
        if (relative.id === draggedRelative) {
          return {
            ...relative,
            x: clamp(0, relative.x + e.movementX, window.innerWidth),
            y: clamp(0, relative.y + e.movementY, window.innerHeight),
          };
        }
        return relative;
      });
    });
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="h-full w-full bg-gray-700"
    >
      {connectionsData.map((connection, i) => {
        return (
          <Connection
            fromId={connection.source}
            toId={connection.target}
            relativeNodes={relatives}
            key={i}
          />
        );
      })}
      <div className="absolute left-0 top-0 h-full w-full">
        {relatives.map((relativeNode, i) => {
          return (
            <RelativeNode
              handleMouseDown={handleMouseDown}
              key={i}
              relativeNode={relativeNode}
            />
          );
        })}
      </div>
    </div>
  );
}

const RelativeNode = ({
  relativeNode,
  handleMouseDown,
}: {
  relativeNode: RelativeNode;
  handleMouseDown: (e: MouseEvent<HTMLDivElement>, id: string) => void;
}) => {
  const { id, x, y, name, description } = relativeNode;
  return (
    <div
      onMouseDown={(e) => handleMouseDown(e, id)}
      style={{ transform: `translate(${x}px, ${y}px)`, width: CARD_WIDTH }}
      className={`absolute`}
    >
      <Card className="flex -translate-x-1/2 -translate-y-1/2 cursor-move select-none flex-col gap-2 p-2">
        <h1 className="text-xl font-bold">{name}</h1>
        <Separator />
        <p>{description}</p>
        <p>
          x:{x} y:{y}
        </p>
      </Card>
    </div>
  );
};

const Connection = ({
  fromId,
  toId,
  relativeNodes,
}: {
  fromId: string | { parent1: string; parent2: string };
  toId: string;
  relativeNodes: RelativeNode[];
}) => {
  if (typeof fromId === 'string') {
    const from = relativeNodes.find((node) => node.id === fromId);
    const to = relativeNodes.find((node) => node.id === toId);

    if (!from || !to) return null;

    return <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
  }

  const parent1 = relativeNodes.find((node) => node.id === fromId.parent1);
  const parent2 = relativeNodes.find((node) => node.id === fromId.parent2);
  const to = relativeNodes.find((node) => node.id === toId);

  if (!parent1 || !parent2 || !to) return null;

  const from = {
    x: (parent1.x + parent2.x) / 2,
    y: (parent1.y + parent2.y) / 2,
  };

  return <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
};

const Line = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => {
  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <line
        stroke="black"
        strokeWidth={3}
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
      ></line>
    </svg>
  );
};
