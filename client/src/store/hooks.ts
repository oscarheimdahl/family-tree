import { useCallback, useRef } from 'react';

import { useAtom } from 'jotai';

import { createConnectionBackend } from '@/apiRoutes/connections';
import { updateRelativeBackend } from '@/apiRoutes/relatives';
import { connectionIncludesId } from '@/lib/utils';
import { BACKEND } from '@/lib/vars';
import { ConnectionSource, ConnectionType, RelativeNodeType } from '@/types/types';

import { connectionsAtom, newConnectionSourceAtom, relativesAtom } from './store';

export const useFinalizeConnection = () => {
  const [newConnectionSource, setNewConnectionSource] = useAtom(newConnectionSourceAtom);
  const [, setConnections] = useAtom(connectionsAtom);

  return (target: ConnectionSource) => {
    let newConnection: ConnectionType;

    // Connecting a couple to a child or
    // connecting a relative to a relative
    if (
      (typeof newConnectionSource === 'object' && typeof target === 'string') ||
      (typeof newConnectionSource === 'string' && typeof target === 'string')
    ) {
      newConnection = {
        id: crypto.randomUUID(),
        source: newConnectionSource,
        target: target,
      };
      // Connecting a child to a couple
    } else if (typeof newConnectionSource === 'string' && typeof target === 'object') {
      newConnection = {
        id: crypto.randomUUID(),
        source: target,
        target: newConnectionSource,
      };
    } else return;

    setConnections((prev) => {
      if (
        prev.some((connection) => {
          // Cant connect to couple relative or child
          const one = connectionIncludesId(connection, newConnection.source);
          const two = connectionIncludesId(connection, newConnection.target);
          return one && two;
        })
      )
        return prev;

      setNewConnectionSource(undefined);
      createConnectionBackend(newConnection);
      return [...prev, newConnection];
    });
  };
};

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedFunction;
}

export const useUpdateRelative = () => {
  const [, setRelatives] = useAtom(relativesAtom);

  const updateRelativeBackendDebounce = useDebounce((relative: RelativeNodeType) => {
    updateRelativeBackend(relative);
  }, 300);

  const setRelativesWithBackendFetch = (
    id: string,
    updateRelativeCallback: (prevRelative: RelativeNodeType) => Partial<RelativeNodeType>,
  ) => {
    setRelatives((prev) => {
      return prev.map((relative) => {
        if (relative.id === id) {
          const updatedRelative: RelativeNodeType = {
            ...relative,
            ...updateRelativeCallback(relative),
          };
          updateRelativeBackendDebounce(updatedRelative);
          return updatedRelative;
        }
        return relative;
      });
    });
  };
  return setRelativesWithBackendFetch;
};
