import { ReactNode, useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { Cable, Edit2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BACKEND } from '@/lib/vars';
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
      name: 'New Relative',
      description: '',
    };
    setRelatives((prev) => [...prev, newRelative]);
    setNewRelativesCreated((prev) => prev + 1);

    fetch(`${BACKEND}/api/relatives`, {
      method: 'POST',
      body: JSON.stringify(newRelative),
    });
  };

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2">
      <div className="animate-fadeIn flex flex-col items-center gap-1 rounded-l-md bg-black p-1 delay-1000">
        <TooltipToggle tooltip="Add new relative">
          <Button
            onMouseLeave={() => setNewRelativesCreated(0)}
            onClick={addNewRelative}
            variant={'ghost'}
            className="w-12 flex-grow p-0"
          >
            <Plus />
          </Button>
        </TooltipToggle>
        <Separator className="w-3/4 self-center" />
        <TooltipToggle tooltip="Add Connection">
          <Toggle
            onPressedChange={(pressed) => setSelectedTool(pressed ? 'add-connection' : undefined)}
            pressed={selectedTool === 'add-connection'}
          >
            <Cable />
          </Toggle>
        </TooltipToggle>
        <TooltipToggle tooltip="Edit Relatives">
          <Toggle
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
