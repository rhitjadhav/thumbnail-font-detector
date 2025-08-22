
import React, { useState, useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploadFormProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onUpload, isLoading }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-gray-800/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center justify-center text-gray-400">
            <UploadIcon />
            <p className="mt-2 font-semibold">
              {fileName ? 'Selected:' : 'Click to browse or drop an image here'}
            </p>
            <p className="text-sm text-gray-500">
              {fileName || 'PNG, JPG, or WEBP'}
            </p>
        </div>
      </button>
    </div>
  );
};

export default ImageUploadForm;
