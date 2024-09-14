import { useAtom } from 'jotai';

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
        source: newConnectionSource,
        target: target,
      };
      // Connecting a child to a couple
    } else if (typeof newConnectionSource === 'string' && typeof target === 'object') {
      newConnection = {
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
      return [...prev, newConnection];
    });
  };
};

export const useUpdateRelative = (relative: RelativeNodeType) => {
  const [, setRelatives] = useAtom(relativesAtom);
};
