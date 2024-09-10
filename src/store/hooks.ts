import { useAtom } from 'jotai';

import { ConnectionSource, ConnectionType } from '@/types/types';

import { connectionsAtom, newConnectionSourceAtom } from './store';

export const useFinalizeConnection = () => {
  const [newConnectionSource, setNewConnectionSource] = useAtom(
    newConnectionSourceAtom,
  );
  const [, setConnections] = useAtom(connectionsAtom);

  return (target: ConnectionSource) => {
    let newConnection: ConnectionType;

    if (
      (typeof newConnectionSource === 'object' && typeof target === 'string') ||
      (typeof newConnectionSource === 'string' && typeof target === 'string')
    ) {
      newConnection = {
        source: newConnectionSource,
        target: target,
      };
    } else if (
      typeof newConnectionSource === 'string' &&
      typeof target === 'object'
    ) {
      newConnection = {
        source: target,
        target: newConnectionSource,
      };
    } else return;

    setConnections((prev) => [...prev, newConnection]);
    setNewConnectionSource(undefined);
  };
};
