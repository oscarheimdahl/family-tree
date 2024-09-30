import { useCallback, useRef } from 'react';

import { useAtom } from 'jotai';
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

import { createConnectionBackend } from '@/apiRoutes/connections';
import { updateRelativeBackend, updateRelativesBackend } from '@/apiRoutes/relatives';
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
      errorToast('Unable to sync');
    }
  };
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      border: '1px solid #d01013',
      backgroundColor: 'white',
      color: 'black',
    },
  });
};

export const useUpdateRelative = () => {
  const [, setRelatives] = useAtom(relativesAtom);

  // const backendUpdate = (relative: RelativeNodeType) => withOnErrorToast(updateRelativeBackend)(relative);

  const updateRelativeBackendDebounce = useDebounce((relative: RelativeNodeType) => {
    withOnErrorToast(updateRelativeBackend)(relative);
  }, 300);
  const updateRelativesBackendDebounce = useDebounce((relatives: RelativeNodeType[]) => {
    withOnErrorToast(updateRelativesBackend)(relatives);
  }, 300);

  const setRelativesWithBackendFetch = (
    id: string | string[],
    updateRelativeCallback: (prevRelative: RelativeNodeType) => Partial<RelativeNodeType>,
  ) => {
    const updatedRelatives: RelativeNodeType[] = [];
    setRelatives((prev) => {
      return prev.map((relative) => {
        const shouldUpdate = typeof id === 'string' ? relative.id === id : id.includes(relative.id);
        if (shouldUpdate) {
          const updatedRelative: RelativeNodeType = {
            ...relative,
            ...updateRelativeCallback(relative),
          };
          updatedRelatives.push(updatedRelative);
          return updatedRelative;
        }
        return relative;
      });
    });

    if (updatedRelatives.length > 1) updateRelativesBackendDebounce(updatedRelatives);
    if (updatedRelatives.length === 1) updateRelativeBackendDebounce(updatedRelatives[0]);
  };
  return setRelativesWithBackendFetch;
};
