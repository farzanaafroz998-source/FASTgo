
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStoreSummary = async (storeName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a catchy 2-sentence marketing summary for a food store named ${storeName}. Mention quality and speed.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fast and delicious food delivered to your door.";
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these delivery stats: ${JSON.stringify(stats)}. Provide a very brief 1-sentence strategic advice for the admin.`,
    });
    return response.text;
  } catch (error) {
    return "Operations are running smoothly today.";
  }
};
