
import React, { useState, useCallback } from 'react';
import { InputType, DetectedFont } from './types';
import { analyzeImageForFonts } from './services/geminiService';
import InputTabs from './components/InputTabs';
import UrlInputForm from './components/UrlInputForm';
import ImageUploadForm from './components/ImageUploadForm';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import FontResultCard from './components/FontResultCard';
import { LogoIcon, SparklesIcon, PhotoIcon } from './components/Icons';

export default function App() {
  const [inputType, setInputType] = useState<InputType>(InputType.URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedFonts, setDetectedFonts] = useState<DetectedFont[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const getBase64FromUrl = async (url: string): Promise<{ base64: string; mimeType: string }> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve({ base64, mimeType: blob.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  const analyseImage = useCallback(async (imgUrl: string) => {
    setIsLoading(true);
    setError(null);
    setDetectedFonts([]);
    setImageUrl(imgUrl);

    try {
      const { base64, mimeType } = await getBase64FromUrl(imgUrl);
      const fonts = await analyzeImageForFonts(base64, mimeType);
      setDetectedFonts(fonts);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUrlSubmit = (url: string) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      const videoId = match[1];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      analyseImage(thumbnailUrl);
    } else {
      setError('Invalid YouTube URL. Please provide a valid video link.');
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        analyseImage(result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Font Detector
            </h1>
        </div>
        <p className="text-lg text-gray-400">Identify fonts in YouTube thumbnails or any image with AI.</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8 border border-gray-700">
          <InputTabs selected={inputType} onSelect={setInputType} />
          <div className="mt-6">
            {inputType === InputType.URL ? (
              <UrlInputForm onSubmit={handleUrlSubmit} isLoading={isLoading} />
            ) : (
              <ImageUploadForm onUpload={handleImageUpload} isLoading={isLoading} />
            )}
          </div>
        </div>

        <div className="mt-10">
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}

          {!isLoading && !error && detectedFonts.length === 0 && (
            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
              <SparklesIcon />
              <p className="mt-4 text-xl">Results will appear here</p>
              <p>Let's find some fonts!</p>
            </div>
          )}

          {!isLoading && (imageUrl || detectedFonts.length > 0) && (
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {imageUrl && (
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><PhotoIcon/> Analyzed Image</h2>
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <img src={imageUrl} alt="Analyzed thumbnail" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
                
                {detectedFonts.length > 0 && (
                    <div className={imageUrl ? "lg:col-span-3" : "lg:col-span-5"}>
                         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><SparklesIcon/> Detected Fonts</h2>
                        <div className="space-y-4">
                            {detectedFonts.map((font, index) => (
                                <FontResultCard key={index} font={font} />
                            ))}
                        </div>
                    </div>
                )}
             </div>
          )}

           {!isLoading && !error && detectedFonts.length === 0 && imageUrl && (
             <div className="text-center text-gray-500 py-12 flex flex-col items-center lg:col-span-3">
                 <p className="mt-4 text-xl">No fonts detected.</p>
                 <p>The AI couldn't find any distinct text in the image. Try another one!</p>
             </div>
           )}

        </div>
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-gray-600 text-sm">
        <p>Powered by Google Gemini. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
