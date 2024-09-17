import { ChangeEvent, useState } from 'react';

import { Input } from '@/components/ui/input';

export const ImageInput = () => {
  const [image, setImage] = useState<string>();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result !== 'string') return;
        setImage(reader.result); // Set the image source to the base64 string
      };
      reader.readAsDataURL(file); // Read the image as base64 data URL
    }
  };

  return (
    <div>
      <Input
        className="file:mr-4 file:rounded-sm file:bg-blue-50 file:text-blue-700"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && (
        <div>
          <h3>Selected Image:</h3>
          <img src={image} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};
