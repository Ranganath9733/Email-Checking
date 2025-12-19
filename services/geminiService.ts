
import { GoogleGenAI, Type } from "@google/genai";
import { EmailValidationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeEmail(email: string): Promise<EmailValidationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following email address for validity, reputation, and patterns: ${email}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          syntaxOk: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER },
          analysis: { type: Type.STRING },
          provider: { type: Type.STRING },
          isDisposable: { type: Type.BOOLEAN },
          possibleTypos: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          category: {
            type: Type.STRING,
            description: "One of: personal, business, disposable, invalid"
          }
        },
        required: ["isValid", "syntaxOk", "score", "analysis", "provider", "isDisposable", "possibleTypos", "category"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return { ...result, email };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    // Fallback
    const basicSyntax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return {
      email,
      isValid: basicSyntax,
      syntaxOk: basicSyntax,
      score: basicSyntax ? 50 : 0,
      analysis: "Basic validation performed due to processing error.",
      provider: email.split('@')[1] || "unknown",
      isDisposable: false,
      possibleTypos: [],
      category: basicSyntax ? 'personal' : 'invalid'
    };
  }
}
