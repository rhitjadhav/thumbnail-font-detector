import React from 'react';
import { DetectedFont } from '../types';

interface FontResultCardProps {
  font: DetectedFont;
}

const getFontFamilyClass = (suggestion: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    if (lowerSuggestion.includes('serif')) return 'font-serif';
    if (lowerSuggestion.includes('mono')) return 'font-mono';
    return 'font-sans';
}

const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
    const percentage = Math.round(value * 100);
    const getBarColor = () => {
        if (percentage >= 85) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div
                className={`${getBarColor()} h-2.5 rounded-full`}
                style={{ width: `${percentage}%` }}
                title={`Confidence: ${percentage}%`}
            ></div>
        </div>
    );
};


const FontResultCard: React.FC<FontResultCardProps> = ({ font }) => {
    const googleFontsUrl = `https://fonts.google.com/?query=${encodeURIComponent(font.fontFamilySuggestion)}`;
    const fontFamilyClass = getFontFamilyClass(font.description);

  return (
    <div className="bg-gray-800/70 p-5 rounded-lg border border-gray-700 shadow-md transition-all hover:border-blue-500/50 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-400">{font.fontName}</h3>
          <p className="text-sm text-gray-400 italic">{font.description}</p>
          <p className={`text-4xl my-4 truncate ${fontFamilyClass}`} title={font.detectedText}>
            {font.detectedText || "Aa Bb Cc"}
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-48">
            <div className="mb-2">
                <p className="text-xs font-medium text-gray-400 mb-1">Confidence</p>
                <ConfidenceMeter value={font.confidence} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-400 mb-1">Suggested Family</p>
                <a 
                    href={googleFontsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                >
                    {font.fontFamilySuggestion} &rarr;
                </a>
            </div>
        </div>
      </div>
       <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-500"><strong className="text-gray-400">AI Reasoning:</strong> {font.reasoning}</p>
       </div>
    </div>
  );
};

export default FontResultCard;