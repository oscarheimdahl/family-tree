import { useCallback, useRef } from 'react';

import { useAtom } from 'jotai';
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

import { createConnectionBackend } from '@/apiRoutes/connections';
import { updateRelativeBackend } from '@/apiRoutes/relatives';
import { connectionIncludesId } from '@/lib/utils';
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
      withOnErrorToast(createConnectionBackend)(newConnection);

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

export const withOnErrorToast = <T extends (...args: any[]) => any>(fn: T) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args);
    } catch (e) {
      toast.error('Unable to sync', {
        style: {
          border: '1px solid #7f0e2a',
          backgroundColor: '#000000',
        },
      });
    }
  };
};

export const useUpdateRelative = () => {
  const [, setRelatives] = useAtom(relativesAtom);

  const updateRelativeBackendDebounce = useDebounce((relative: RelativeNodeType) => {
    withOnErrorToast(updateRelativeBackend)(relative);
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