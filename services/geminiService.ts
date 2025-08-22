import { GoogleGenAI, Type } from "@google/genai";
import { DetectedFont } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fontDetectionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        detectedText: {
            type: Type.STRING,
            description: "The actual text snippet from the image that is identified as using this font.",
        },
        fontName: {
          type: Type.STRING,
          description: "The most likely name of the detected font.",
        },
        description: {
          type: Type.STRING,
          description: "A brief description of the font's style (e.g., 'Bold sans-serif', 'Playful script')."
        },
        fontFamilySuggestion: {
          type: Type.STRING,
          description: "A suggestion for a similar, freely available font family (e.g., from Google Fonts) like 'Roboto', 'Lato', 'Montserrat', etc."
        },
        confidence: {
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 indicating the likelihood of the match."
        },
        reasoning: {
            type: Type.STRING,
            description: "A brief explanation for why this font was chosen, based on visual characteristics."
        }
      },
      required: ["detectedText", "fontName", "description", "fontFamilySuggestion", "confidence", "reasoning"],
    },
};

export async function analyzeImageForFonts(base64Image: string, mimeType: string): Promise<DetectedFont[]> {
    const imagePart = {
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

    const contents = {
        parts: [imagePart, { text: prompt }]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: fontDetectionSchema,
            }
        });

        const jsonText = response.text.trim();
        
        if (!jsonText) {
            return [];
        }

        const parsedJson = JSON.parse(jsonText);
        return parsedJson as DetectedFont[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("AI analysis failed. The model could not process the request.");
    }
}