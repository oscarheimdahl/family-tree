import { ReactNode, useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { Cable, Edit2, Plus, UserRoundPlus } from 'lucide-react';

import { createRelativeBackend } from '@/apiRoutes/relatives';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { withOnErrorToast } from '@/store/hooks';
import { canvasOffsetAtom, canvasZoomAtom, relativesAtom, selectedToolAtom } from '@/store/store';

import { snapToGrid } from './Canvas';

export const Tools = () => {
  const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom);
  const [canvasOffset] = useAtom(canvasOffsetAtom);
  const [, setRelatives] = useAtom(relativesAtom);
  const [canvasZoom] = useAtom(canvasZoomAtom);
  const [newRelativesCreated, setNewRelativesCreated] = useState(0);

  useEffect(() => {
    const removeLine = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTool(undefined);
      }
    };
    document.addEventListener('keydown', removeLine);
    return () => document.removeEventListener('keydown', removeLine);
  }, []);

  const addNewRelative = () => {
    const newRelative = {
      id: crypto.randomUUID(),
      x: snapToGrid((-canvasOffset.x + window.innerWidth / 2) / canvasZoom + newRelativesCreated * 50),
      y: snapToGrid((-canvasOffset.y + window.innerHeight / 2) / canvasZoom + newRelativesCreated * 50),
      name: '',
      description: '',
      birthYear: 0,
    };
    setRelatives((prev) => [...prev, newRelative]);
    setNewRelativesCreated((prev) => prev + 1);

    withOnErrorToast(createRelativeBackend)(newRelative);
  };

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2">
      <div className="animate-fadeInRight flex flex-col items-center gap-1 rounded-l-md border border-gray-400 bg-white p-1 text-slate-800 shadow-md delay-200">
        <TooltipToggle tooltip="Add new relative">
          <Button
            onMouseLeave={() => setNewRelativesCreated(0)}
            onClick={addNewRelative}
            variant={'ghost'}
            className="size-12 flex-grow p-0"
          >
            <UserRoundPlus />
          </Button>
        </TooltipToggle>
        <Separator />
        <TooltipToggle tooltip="Add Connection">
          <Toggle
            className="size-12 p-0"
            onPressedChange={(pressed) => setSelectedTool(pressed ? 'add-connection' : undefined)}
            pressed={selectedTool === 'add-connection'}
          >
            <Cable />
          </Toggle>
        </TooltipToggle>
        <Separator />
        <TooltipToggle tooltip="Edit Relatives">
          <Toggle
            className="size-12 p-0"
            onPressedChange={(pressed) => setSelectedTool(pressed ? 'edit' : undefined)}
            pressed={selectedTool === 'edit'}
          >
            <Edit2 />
          </Toggle>
        </TooltipToggle>
      </div>
    </div>
  );
};

const TooltipToggle = ({ tooltip, children }: { tooltip: string; children: ReactNode }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="left">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
