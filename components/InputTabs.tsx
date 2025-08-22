
import React from 'react';
import { InputType } from '../types';
import { LinkIcon, UploadIcon } from './Icons';

interface InputTabsProps {
  selected: InputType;
  onSelect: (type: InputType) => void;
}

const InputTabs: React.FC<InputTabsProps> = ({ selected, onSelect }) => {
  const commonClasses = 'w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500';
  const selectedClasses = 'bg-blue-600 text-white';
  const unselectedClasses = 'bg-gray-700/50 text-gray-300 hover:bg-gray-700';

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect(InputType.URL)}
        className={`${commonClasses} ${selected === InputType.URL ? selectedClasses : unselectedClasses}`}
        aria-pressed={selected === InputType.URL}
      >
        <LinkIcon />
        Paste YouTube Link
      </button>
      <button
        onClick={() => onSelect(InputType.UPLOAD)}
        className={`${commonClasses} ${selected === InputType.UPLOAD ? selectedClasses : unselectedClasses}`}
        aria-pressed={selected === InputType.UPLOAD}
      >
        <UploadIcon />
        Upload Image
      </button>
    </div>
  );
};

export default InputTabs;
