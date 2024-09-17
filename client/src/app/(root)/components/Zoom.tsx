import { useAtom } from 'jotai';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCanvasZoomOnPoint } from '@/lib/hooks/useCanvasZoomOnPoint';
import { canvasZoomAtom } from '@/store/store';

export const Zoom = () => {
  const [zoom] = useAtom(canvasZoomAtom);
  const zoomOnPoint = useCanvasZoomOnPoint();

  const handleZoomIn = () => {
    zoomOnPoint(zoom + 0.1, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };
  const handleZoomOut = () => {
    zoomOnPoint(zoom - 0.1, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  return (
    <div className="animate-fadeInLeft absolute bottom-0 left-0 flex flex-col gap-2 p-4 delay-200">
      <Button variant={'ghost'} onClick={handleZoomIn} className="border bg-black p-2 text-white">
        <Plus />
      </Button>
      <Button variant={'ghost'} onClick={handleZoomOut} className="border bg-black p-2 text-white">
        <Minus />
      </Button>
    </div>
  );
};
