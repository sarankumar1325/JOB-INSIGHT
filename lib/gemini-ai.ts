import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyD1hahTBc7VeuFbCQmUDPXl46IHJLkDIh8";

export const genAI = new GoogleGenAI({
  apiKey: apiKey,
});

export const model = "gemini-2.0-flash";

export const chatSession = genAI.chats.create({
  model: model,
  config: {
    maxOutputTokens: 8192,
    temperature: 1,
  },
});
