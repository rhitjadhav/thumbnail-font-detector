
import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isLoading}
        className="flex-grow bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex-shrink-0 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <SearchIcon />
        Analyze
      </button>
    </form>
  );
};

export default UrlInputForm;
