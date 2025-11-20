
import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, AIAnalysisResult, TicketPriority } from "../types";

// Initialize Gemini Client
// Ensure API Key is available in environment
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const analyzeTicketWithGemini = async (ticket: Ticket): Promise<AIAnalysisResult | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  const prompt = `
    You are an expert IT Service Management (ITSM) AI Assistant.
    Analyze the following ticket details and provide a structured assessment.
    
    Ticket Title: ${ticket.title}
    Ticket Description: ${ticket.description}
    Current Type: ${ticket.type}
    Product ID: ${ticket.productId}
    
    Please determine:
    1. The recommended Priority level (LOW, MEDIUM, HIGH, CRITICAL).
    2. A refined Fault Type (category) if applicable.
    3. A concise one-sentence summary.
    4. A hypothesis for the root cause based on common IT patterns.
    5. A category for the root cause (e.g., Code Error, Configuration, Hardware, User Error, Network).
    6. Sentiment of the reporter (POSITIVE, NEUTRAL, NEGATIVE).
    7. A polite, professional draft response to the user acknowledging the issue and suggesting next steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPriority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            suggestedType: { type: Type.STRING },
            summary: { type: Type.STRING },
            rootCauseHypothesis: { type: Type.STRING },
            suggestedRootCauseCategory: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] },
            draftResponse: { type: Type.STRING },
          },
          required: ['suggestedPriority', 'suggestedType', 'summary', 'rootCauseHypothesis', 'sentiment', 'draftResponse']
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    // Map string priority to Enum
    let priorityEnum = TicketPriority.MEDIUM;
    if (data.suggestedPriority === 'LOW') priorityEnum = TicketPriority.LOW;
    if (data.suggestedPriority === 'HIGH') priorityEnum = TicketPriority.HIGH;
    if (data.suggestedPriority === 'CRITICAL') priorityEnum = TicketPriority.CRITICAL;

    return {
      suggestedPriority: priorityEnum,
      suggestedType: data.suggestedType,
      summary: data.summary,
      rootCauseHypothesis: data.rootCauseHypothesis,
      suggestedRootCauseCategory: data.suggestedRootCauseCategory,
      sentiment: data.sentiment as any,
      draftResponse: data.draftResponse
    };

  } catch (error) {
    console.error("Error analyzing ticket with Gemini:", error);
    return null;
  }
};
