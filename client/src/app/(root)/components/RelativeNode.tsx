import { Separator } from '@radix-ui/react-separator';
import { useAtom } from 'jotai';
import { Cable, Trash, X } from 'lucide-react';
import Image from 'next/image';

import profileImage from '@/assets/profile.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn, connectionIncludesId } from '@/lib/utils';
import { useFinalizeConnection } from '@/store/hooks';
import {
  connectionsAtom,
  draggedRelativeAtom,
  newConnectionSourceAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';
import { type RelativeNodeType } from '@/types/types';

export const CARD_WIDTH = 250;

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
      className={`absolute z-20`}
    >
      <div className="animate-appear">
        <Card
          onDoubleClick={() => setSelectedTool('edit')}
          onClick={() => {
            if (!newConnectionSource) return;
            finalizeConnection(id);
          }}
          className={cn(
            'pointer-events-auto relative flex -translate-x-1/2 -translate-y-1/2 cursor-move select-none flex-col gap-2 bg-black p-2 pt-12',
            selectedTool === 'edit' && 'cursor-auto',
            newConnectionSource && newConnectionSource !== id && 'cursor-pointer ring-white hover:ring',
          )}
        >
          <Image
            alt="asd"
            width={64}
            height={64}
            src={profileImage}
            className="absolute -top-6 left-1/2 size-16 -translate-x-1/2 rounded-full bg-slate-800 ring ring-white"
          ></Image>
          {selectedTool === 'edit' ? (
            <Input
              onMouseDown={(e) => e.stopPropagation()}
              value={name}
              className="-ml-1 pl-1 text-xl font-bold"
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
            x:{removeDecimals(x)} y:{removeDecimals(y)}
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
          return prev.filter((connection) => !connectionIncludesId(connection, id));
        });
      }}
      variant={'destructive'}
      className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 p-2"
    >
      {<Trash />}
    </Button>
  );
};

function removeDecimals(number: number) {
  return Math.round(number);
}
