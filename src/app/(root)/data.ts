import { ConnectionType, RelativeNodeType } from '@/types/types';

export const relativesData: RelativeNodeType[] = [
  {
    id: crypto.randomUUID(),
    x: 200,
    y: 300,
    name: 'Oscar',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 400,
    y: 300,
    name: 'Tove',
    description: 'He is a great guy',
  },
  {
    id: crypto.randomUUID(),
    x: 300,
    y: 500,
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
    x: 300,
    y: 100,
    name: 'Ingela',
    description: 'He is a great guy',
  },
];

export const connectionsData: ConnectionType[] = [
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
