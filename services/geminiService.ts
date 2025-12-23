
import { GoogleGenAI, Type } from "@google/genai";
import { Subtitle, AppLanguage } from "../types";

export const generateSubtitles = async (
  file: File,
  language: AppLanguage
): Promise<Subtitle[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert file to base64
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  });

  const mimeType = file.type;

  const prompt = `
    Transcribe this video/audio into subtitles in ${language}. 
    Return an array of subtitle objects.
    Each object must have "startTime" (seconds), "endTime" (seconds), and "text" (the transcription).
    Ensure the timing is accurate and matches the speech.
    If the language is "Banglish", use English characters to write Bengali phonetically.
    If the language is "Hindilish", use English characters to write Hindi phonetically.
    If the language is "Bangla", use Bengali script.
    If the language is "Hindi", use Devanagari script.
  `;

  // Using gemini-3-pro-preview for complex transcription tasks as per guidelines
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            startTime: { type: Type.NUMBER },
            endTime: { type: Type.NUMBER },
            text: { type: Type.STRING },
          },
          required: ["startTime", "endTime", "text"],
        },
      },
    },
  });

  // response.text is a property, not a method
  const rawJson = response.text;
  if (!rawJson) return [];

  const parsed: any[] = JSON.parse(rawJson);
  return parsed.map((item, index) => ({
    id: `sub-${index}-${Date.now()}`,
    startTime: item.startTime,
    endTime: item.endTime,
    text: item.text,
  }));
};
