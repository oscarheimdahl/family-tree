export type RelativeNodeType = {
  id: string;
  x: number;
  y: number;
  name: string;
  description?: string;
};

// The source is either from a node to another (couple) or from two parents to a child
export type ConnectionSource = string | { parent1: string; parent2: string };

export type ConnectionType = {
  source: ConnectionSource;
  target: string;
};
