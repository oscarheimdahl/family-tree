import { ChangeEvent } from 'react';

import { useAtom } from 'jotai';
import { Cable, Trash, X } from 'lucide-react';

import { deleteConnectionBackend } from '@/apiRoutes/connections';
import { deleteRelativeBackend } from '@/apiRoutes/relatives';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn, connectionIncludesId } from '@/lib/utils';
import { useFinalizeConnection, useUpdateRelative, withOnErrorToast } from '@/store/hooks';
import {
  connectionsAtom,
  draggedRelativeAtom,
  hideHoveredRelativeTimeoutRefAtom,
  hoveredRelativeAtom,
  newConnectionSourceAtom,
  relativesAtom,
  selectedToolAtom,
} from '@/store/store';
import { type RelativeNodeType } from '@/types/types';

import { ProfileImage } from './ProfileImage';

export const CARD_WIDTH = 250;

export const RelativeNode = ({ relativeNode }: { relativeNode: RelativeNodeType }) => {
  const { id, x, y, name, description, birthYear, selected, imageUrl } = relativeNode;
  const [newConnectionSource] = useAtom(newConnectionSourceAtom);
  const [, setDraggedRelative] = useAtom(draggedRelativeAtom);
  const [, setHoveredRelative] = useAtom(hoveredRelativeAtom);
  const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom);
  const [hideHoveredRelativeTimeoutRef, setHideHoveredRelativeTimeoutRef] = useAtom(hideHoveredRelativeTimeoutRefAtom);
  const updateRelative = useUpdateRelative();

  const finalizeConnection = useFinalizeConnection();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateRelative(id, () => ({
      name: e.target.value ?? '',
    }));
  };
  const handlebirthYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateRelative(id, () => ({
      birthYear: +e.target.value || 0,
    }));
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateRelative(id, () => ({
      description: e.target.value ?? '',
    }));
  };

  return (
    <div
      onMouseEnter={() => {
        if (hideHoveredRelativeTimeoutRef) {
          clearTimeout(hideHoveredRelativeTimeoutRef);
          setHideHoveredRelativeTimeoutRef(undefined);
        }
        setHoveredRelative(relativeNode.id);
      }}
      onMouseLeave={() => {
        const timeout = setTimeout(() => setHoveredRelative(undefined), 5000);
        setHideHoveredRelativeTimeoutRef(timeout);
      }}
      onMouseDown={() => setDraggedRelative(id)}
      style={{ transform: `translate(${x}px, ${y}px)`, width: CARD_WIDTH }}
      className="absolute"
    >
      <div className="animate-appear">
        <Card
          onDoubleClick={() => setSelectedTool('edit')}
          onClick={() => {
            if (!newConnectionSource) return;
            finalizeConnection(id);
          }}
          className={cn(
            'border-1 pointer-events-auto relative flex -translate-x-1/2 -translate-y-1/2 cursor-move select-none flex-col gap-2 bg-gray-50 p-2 pt-20 shadow-md',
            selectedTool === 'edit' && 'cursor-auto',
            selected && 'ring ring-slate-800',
            newConnectionSource && newConnectionSource !== id && 'cursor-pointer ring-slate-800 hover:ring',
          )}
        >
          <ProfileImage imageUrl={imageUrl} relativeId={id} />
          {selectedTool === 'edit' ? (
            <>
              <Input
                placeholder="Name"
                onMouseDown={(e) => e.stopPropagation()}
                value={name}
                className="border-black text-xl font-bold"
                onChange={handleNameChange}
              />
              <Input
                type="number"
                placeholder="Birthyear"
                onWheel={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                value={birthYear || ''}
                className="border-black font-bold"
                onChange={handlebirthYearChange}
              />
            </>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{name || <span className="opacity-50">Name</span>}</h1>
              <h1 className="font-bold text-slate-800">{birthYear || <span className="opacity-50">Birthyear</span>}</h1>
            </div>
          )}

          <Separator />
          {selectedTool === 'edit' ? (
            <Textarea
              onMouseDown={(e) => e.stopPropagation()}
              onChange={handleDescriptionChange}
              value={description}
              placeholder="Description"
              className="border-black text-base"
            />
          ) : (
            <p className={cn('max-h-24 overflow-hidden text-clip')}>
              {description || <span className="opacity-50">Description</span>}
            </p>
          )}
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
          return prev.filter((relative) => {
            const remove = relative.id !== id;
            if (remove) {
              withOnErrorToast(deleteRelativeBackend)(id);
            }
            return remove;
          });
        });
        setConnections((prev) => {
          return prev.filter((connection) => {
            const remove = connectionIncludesId(connection, id);
            if (remove) {
              deleteConnectionBackend(connection.id);
              deleteConnectionBackend(id);
            }
            return !remove;
          });
        });
      }}
      variant={'destructive'}
      className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 p-2"
    >
      {<Trash />}
    </Button>
  );
};
