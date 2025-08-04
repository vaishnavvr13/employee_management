import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBMB9NlE_G07j_Q8J4aBy_r5R-gAqcgxxU",
});

export async function askGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    // Ensure a string is always returned
    return response.text ?? "No response from AI.";
  } catch (error) {
    console.error("AI error:", error);
    return "Sorry, something went wrong.";
  }
}
