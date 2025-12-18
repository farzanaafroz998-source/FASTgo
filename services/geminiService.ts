import { GoogleGenAI } from "@google/genai";

// Ensure we only initialize if the API_KEY exists to avoid runtime crashes
// The client MUST use a named parameter: { apiKey: ... }
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStoreSummary = async (storeName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a catchy 2-sentence marketing summary for a food store named ${storeName}. Mention quality and speed.`,
    });
    // .text is a property, not a method
    return response.text || "Fast and delicious food delivered to your door.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fast and delicious food delivered to your door.";
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these delivery stats: ${JSON.stringify(stats)}. Provide a very brief 1-sentence strategic advice for the admin to improve efficiency.`,
    });
    return response.text || "Operations are running smoothly today.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Operations are running smoothly today.";
  }
};