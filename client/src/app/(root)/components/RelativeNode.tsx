import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useAtom } from 'jotai';
import { Cable, Edit, Trash, X } from 'lucide-react';
import Image from 'next/image';

import { deleteConnectionBackend } from '@/apiRoutes/connections';
import { deleteRelativeBackend, updateRelativeImageBackend } from '@/apiRoutes/relatives';
import fallbackProfileImage from '@/assets/profile.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn, connectionIncludesId } from '@/lib/utils';
import { errorToast, useFinalizeConnection, useUpdateRelative, withOnErrorToast } from '@/store/hooks';
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
            'pointer-events-auto relative flex -translate-x-1/2 -translate-y-1/2 cursor-move select-none flex-col gap-2 bg-black p-2 pt-14',
            selectedTool === 'edit' && 'cursor-auto',
            selected && 'ring ring-gray-400',
            newConnectionSource && newConnectionSource !== id && 'cursor-pointer ring-orange-300 hover:ring',
          )}
        >
          <ProfileImage imageUrl={imageUrl} relativeId={id} />
          {selectedTool === 'edit' ? (
            <>
              <Input
                placeholder="Name"
                onMouseDown={(e) => e.stopPropagation()}
                value={name}
                className="text-xl font-bold"
                onChange={handleNameChange}
              />
              <Input
                type="number"
                placeholder="Birthyear"
                onWheel={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                value={birthYear || ''}
                className="font-bold"
                onChange={handlebirthYearChange}
              />
            </>
          ) : (
            <div>
              <h1 className="text-xl font-bold">{name || <span className="opacity-50">Name</span>}</h1>
              <h1 className="font-bold text-slate-700">
                {birthYear || <span className="text-white opacity-50">Birthyear</span>}
              </h1>
            </div>
          )}

          <Separator />
          {selectedTool === 'edit' ? (
            <Textarea
              onMouseDown={(e) => e.stopPropagation()}
              onChange={handleDescriptionChange}
              value={description}
              className="text-base"
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

const MB = 1024 * 1024;
export const ProfileImage = ({ relativeId, imageUrl }: { relativeId: string; imageUrl: string | undefined }) => {
  const [selectedTool] = useAtom(selectedToolAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shownImage, setShownImage] = useState<string | undefined>(imageUrl);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > MB) {
      return errorToast('Image too large, max 1 MB');
    }
    const newImageURL = URL.createObjectURL(file);
    setShownImage(newImageURL);

    withOnErrorToast(updateRelativeImageBackend)(relativeId, file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'group absolute -top-12 left-1/2 grid size-24 -translate-x-1/2 place-content-center place-items-center overflow-hidden rounded-full bg-slate-800 ring ring-white [&>*]:[grid-area:1/1]',
      )}
    >
      <Dialog>
        <DialogTrigger
          className={cn('group', selectedTool === 'edit' && 'pointer-events-none')}
          disabled={selectedTool === 'edit'}
        >
          <Image
            draggable={false}
            alt="relative"
            fill
            className="object-cover"
            src={shownImage ?? fallbackProfileImage}
          ></Image>
        </DialogTrigger>
        <DialogContent className="flex h-fit w-fit justify-center overflow-hidden rounded-md p-0 ring ring-white [&>button]:hidden">
          <DialogTitle className="opacity-0">Image</DialogTitle>
          <Image
            draggable={false}
            alt="relative"
            width={400}
            height={400}
            src={shownImage ?? fallbackProfileImage}
          ></Image>
        </DialogContent>
      </Dialog>
      {selectedTool === 'edit' && (
        <button
          onClick={handleButtonClick}
          className="pointer-events-auto z-10 hidden h-full w-full items-center justify-center bg-black/20 group-hover:flex"
        >
          <Edit size={32} />
        </button>
      )}
      <input
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
    </div>
  );
};
