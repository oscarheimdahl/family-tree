import { useAtom } from 'jotai';
import Image from 'next/image';

import fallbackProfileImage from '@/assets/profile.png';
import { Card } from '@/components/ui/card';
import { hoveredRelativeAtom, relativesAtom } from '@/store/store';

export const HoveredRelative = () => {
  const [hoveredRelative] = useAtom(hoveredRelativeAtom);
  const [relatives] = useAtom(relativesAtom);

  const relative = relatives.find((relative) => relative.id === hoveredRelative);
  if (!relative) return null;

  return (
    <Card className="absolute bottom-0 right-0 m-4 flex items-center gap-4 px-4 py-2 text-white">
      <div className="relative flex h-full flex-col justify-between">
        <span className="text-xl font-bold">
          {relative.name ? relative.name : <span className="opacity-50">Name</span>}
        </span>
        <span className="font-bold">
          {relative.birthYear ? relative.birthYear : <span className="opacity-50">-</span>}
        </span>
      </div>
      <Image
        className="block max-h-16 min-h-16 min-w-16 max-w-16 -translate-y-1/2 rounded-full bg-slate-800 object-cover ring ring-white"
        src={relative.imageUrl ?? fallbackProfileImage}
        alt={relative.name}
        width={64}
        height={64}
      />
    </Card>
  );
};
