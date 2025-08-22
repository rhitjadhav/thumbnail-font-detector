export enum InputType {
    URL = 'url',
    UPLOAD = 'upload',
}
  
export interface DetectedFont {
    fontName: string;
    description: string;
    fontFamilySuggestion: string;
    confidence: number;
    reasoning: string;
    detectedText: string;
}