import { Separator } from '@radix-ui/react-separator';
import { useAtom } from 'jotai';
import { Cable, Trash, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFinalizeConnection } from '@/store/hooks';
import {
  connectionsAtom,
  draggedRelativeAtom,
  newConnectionSourceAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';
import { ConnectionSource, ConnectionType, type RelativeNodeType } from '@/types/types';

export const CARD_WIDTH = 160;

export const RelativeNode = ({ relativeNode }: { relativeNode: RelativeNodeType }) => {
  const { id, x, y, name, description } = relativeNode;
  const [newConnectionSource] = useAtom(newConnectionSourceAtom);
  const [, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom);
  const [, setRelatives] = useAtom(relativesAtom);

  const finalizeConnection = useFinalizeConnection();

  return (
    <div
      onMouseDown={() => setDraggedRelative(id)}
      style={{ transform: `translate(${x}px, ${y}px)`, width: CARD_WIDTH }}
      className={`absolute`}
    >
      <div className="animate-appear">
        <Card
          onDoubleClick={() => setSelectedTool('edit')}
          onClick={() => {
            if (!newConnectionSource) return;
            finalizeConnection(id);
          }}
          className={cn(
            'pointer-events-auto relative flex -translate-x-1/2 -translate-y-1/2 cursor-move select-none flex-col gap-2 p-2 pt-10',
            selectedTool === 'edit' && 'cursor-auto',
            newConnectionSource && newConnectionSource !== id && 'cursor-pointer ring-white hover:ring',
          )}
        >
          <div className="absolute -top-6 left-1/2 size-16 -translate-x-1/2 rounded-full bg-slate-800 ring ring-white"></div>
          {selectedTool === 'edit' ? (
            <Input
              onMouseDown={(e) => e.stopPropagation()}
              value={name}
              className="text-xl font-bold"
              onChange={(e) => {
                setRelatives((prev) => {
                  return prev.map((relative) => {
                    if (relative.id === id) {
                      return {
                        ...relative,
                        name: e.target.value ?? '',
                      };
                    }
                    return relative;
                  });
                });
              }}
            />
          ) : (
            <h1 className="text-xl font-bold">{name}</h1>
          )}

          <Separator />
          <p>{description}</p>
          <p>
            x:{x} y:{y}
          </p>
          <NewConnectionSourceButton id={id} />
          <DeleteButton id={id} />
        </Card>
      </div>
    </div>
  );
};

const NewConnectionSourceButton = ({ id }: { id: string }) => {
  const [selectedTool] = useAtom(selectedToolAtom);
  const [newConnectionSource, setNewConnectionSource] = useAtom(newConnectionSourceAtom);

  if (selectedTool !== 'add-connection') return null;

  const connectionStartedFromThisNode = newConnectionSource === id;

  if (newConnectionSource && !connectionStartedFromThisNode) return null;

  return (
    <Button
      onClick={() => {
        if (newConnectionSource) setNewConnectionSource(undefined);
        else setNewConnectionSource(id);
      }}
      className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 p-2"
    >
      {connectionStartedFromThisNode ? <X /> : <Cable />}
    </Button>
  );
};

const DeleteButton = ({ id }: { id: string }) => {
  const [selectedTool] = useAtom(selectedToolAtom);
  const [, setRelatives] = useAtom(relativesAtom);
  const [, setConnections] = useAtom(connectionsAtom);

  if (selectedTool !== 'edit') return null;

  return (
    <Button
      onClick={() => {
        setRelatives((prev) => {
          return prev.filter((relative) => relative.id !== id);
        });
        setConnections((prev) => {
          return prev.filter((connection) => connectionIncludesId(connection, id));
        });
      }}
      variant={'destructive'}
      className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 p-2"
    >
      {<Trash />}
    </Button>
  );
};

function connectionIncludesId(connection: ConnectionType, id: ConnectionSource) {
  if (typeof connection.source === 'string' && connection.source === id) return false;
  if (typeof connection.target === 'string' && connection.target === id) return false;
  if (typeof connection.source === 'object' && connection.source.parent1 === id) return false;
  if (typeof connection.source === 'object' && connection.source.parent2 === id) return false;
  return true;
}
