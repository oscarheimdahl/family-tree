import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ConnectionSource, ConnectionType } from '@/types/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIncludesId(connection: ConnectionType, id: ConnectionSource) {
  if (typeof id === 'string') {
    if (typeof connection.source === 'string' && connection.source === id) return true;
    if (typeof connection.target === 'string' && connection.target === id) return true;
    if (typeof connection.source === 'object' && connection.source.parent1 === id) return true;
    if (typeof connection.source === 'object' && connection.source.parent2 === id) return true;
    return false;
  }
  if (typeof connection.source === 'string' && connection.source === id.parent1) return true;
  if (typeof connection.source === 'string' && connection.source === id.parent2) return true;
  if (typeof connection.target === 'string' && connection.target === id.parent1) return true;
  if (typeof connection.target === 'string' && connection.target === id.parent2) return true;
  if (typeof connection.source === 'object' && connection.source.parent1 === id.parent1) return true;
  if (typeof connection.source === 'object' && connection.source.parent1 === id.parent2) return true;
  if (typeof connection.source === 'object' && connection.source.parent2 === id.parent1) return true;
  if (typeof connection.source === 'object' && connection.source.parent2 === id.parent2) return true;
  return false;
}

export function connectionsIdentical(connection1: ConnectionType, connection2: ConnectionType) {
  if (typeof connection1.source === 'string' && typeof connection2.source === 'string') {
    return connection1.source === connection2.source && connection1.target === connection2.target;
  }
  if (typeof connection1.source === 'object' && typeof connection2.source === 'object') {
    return (
      connection1.source.parent1 === connection2.source.parent1 &&
      connection1.source.parent2 === connection2.source.parent2 &&
      connection1.target === connection2.target
    );
  }
  return false;
}

/**
 * Checks if a connection is attached to another connection (child)
 */
export function connectionSourceOnConnection(
  connection: ConnectionType,
  connectionSource: { parent1: ConnectionSource; parent2: string },
) {
  if (typeof connection.source === 'string') return false;
  if (typeof connection.source === 'object') {
    return (
      connection.source.parent1 === connectionSource.parent1 || connection.source.parent2 === connectionSource.parent2
    );
  }
  return false;
}
