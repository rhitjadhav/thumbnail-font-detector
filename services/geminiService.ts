import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, SafetySetting, Part, Content } from "@google/generative-ai";
import { DetectedFont } from '../types';

// IMPORTANT: Access the API key from Vite's environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please add it to your .env file or hosting provider's settings.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    temperature: 0.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
};

// Define the JSON schema for the expected output.
const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        detectedText: {
            type: "string",
            description: "The actual text snippet from the image that is identified as using this font.",
        },
        fontName: {
          type: "string",
          description: "The most likely name of the detected font.",
        },
        description: {
          type: "string",
          description: "A brief description of the font's style (e.g., 'Bold sans-serif', 'Playful script')."
        },
        fontFamilySuggestion: {
          type: "string",
          description: "A suggestion for a similar, freely available font family (e.g., from Google Fonts) like 'Roboto', 'Lato', 'Montserrat', etc."
        },
        confidence: {
            type: "number",
            description: "A confidence score from 0.0 to 1.0 indicating the likelihood of the match."
        },
        reasoning: {
            type: "string",
            description: "A brief explanation for why this font was chosen, based on visual characteristics."
        }
      },
      required: ["detectedText", "fontName", "description", "fontFamilySuggestion", "confidence", "reasoning"],
    },
};

// Add the schema to the generation config.
generationConfig.responseSchema = schema;


export async function analyzeImageForFonts(base64Image: string, mimeType: string): Promise<DetectedFont[]> {
    const imagePart: Part = {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
    };

    const prompt = `
        You are a font detection expert. Analyze the provided image, which is likely a YouTube thumbnail.
        Identify all distinct fonts visible in the image.
        For each font you identify, you MUST also extract the exact text snippet from the image that uses this font.
        Provide the font's likely name, a style description, a similar free font suggestion, a confidence score, your reasoning, and the detected text itself.
        Respond only with the JSON object defined in the schema. If no text or fonts are found, return an empty array.
    `;

    const contents: Content[] = [
        { parts: [imagePart, { text: prompt }] }
    ];

    try {
        const result = await model.generateContent({
            contents: contents,
            generationConfig: generationConfig,
        });

        const response = result.response;
        // Make sure to handle cases where the response might be empty or invalid
        const jsonText = response.text()?.trim();

        if (!jsonText) {
            console.warn("AI response was empty.");
            return [];
        }

        const parsedJson = JSON.parse(jsonText);
        return parsedJson as DetectedFont[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a more specific error message if possible
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("AI analysis failed. The provided API key is not valid. Please check your key.");
        }
        throw new Error("AI analysis failed. The model could not process the request.");
    }
}
```typescript:vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
  // The 'define' block for environment variables is no longer needed.
  // Vite automatically handles environment variables prefixed with "VITE_".
})
