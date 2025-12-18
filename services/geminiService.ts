import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle AI-powered insights for FASTgo.
 * It uses the Gemini 3 Flash model for cost-effective, fast text generation.
 */

export const getStoreSummary = async (storeName: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Fast and delicious food delivered to your door with FASTgo's premium service.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a catchy 2-sentence marketing summary for a food store named ${storeName}. Mention quality and speed.`,
      config: {
        systemInstruction: "You are a professional marketing copywriter for a high-end food delivery platform. Keep responses punchy, appetizing, and under 40 words.",
      }
    });

    // .text is a property, not a method.
    return response.text || "Expertly prepared dishes delivered with lightning speed.";
  } catch (error) {
    console.warn("Gemini Service (Store Summary) Error:", error);
    return "Fast and delicious food delivered to your door.";
  }
};

export const getAdminInsights = async (stats: any) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Operational efficiency is currently optimal. Keep monitoring live metrics.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these delivery stats: ${JSON.stringify(stats)}. Provide a very brief 1-sentence strategic advice for the admin to improve efficiency.`,
      config: {
        systemInstruction: "You are a data analyst for a logistics company. Provide concise, actionable strategic advice based on real-time data.",
      }
    });

    return response.text || "Maintain current logistics flow to ensure delivery consistency.";
  } catch (error) {
    console.warn("Gemini Service (Admin Insights) Error:", error);
    return "Operations are running smoothly today.";
  }
};