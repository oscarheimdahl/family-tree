import { ChangeEvent, useRef, useState } from 'react';

import { useAtom } from 'jotai';
import { Edit } from 'lucide-react';
import Image from 'next/image';

import { updateRelativeImageBackend } from '@/apiRoutes/relatives';
import fallbackProfileImage from '@/assets/profile.png';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { errorToast, withOnErrorToast } from '@/store/hooks';
import { selectedToolAtom } from '@/store/store';

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
        'group absolute -top-[4.5rem] left-1/2 grid size-36 -translate-x-1/2 place-content-center place-items-center overflow-hidden rounded-full bg-white shadow-md [&>*]:[grid-area:1/1]',
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
          <DialogTitle className="absolute opacity-0">Image</DialogTitle>
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
          className="pointer-events-auto z-10 hidden h-full w-full rounded-md bg-black/20 p-4 text-white group-hover:block"
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
