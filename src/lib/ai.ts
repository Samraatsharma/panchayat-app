import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "dummy-key";

export const ai = new GoogleGenAI({ apiKey });

/**
 * Parses conversational voice input into a structured complaint ticket.
 */
export async function parseComplaintVoice(text: string) {
  const prompt = `
  You are an assistant for a housing society app. 
  A resident just recorded a voice message complaining or suggesting something.
  The transcription is: "${text}"

  Parse this into JSON format with the following structure:
  {
    "category": "Maintenance" | "Plumbing" | "Electrical" | "Security" | "Cleanliness" | "Other",
    "issue": "Extract the main issue in 5-10 words",
    "priority": "Low" | "Medium" | "High"
  }
  
  Do not include any other text, just the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    // Clean up potential markdown formatting around JSON
    const textRes = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (textRes) {
      return JSON.parse(textRes);
    }
    return null;
  } catch (error) {
    console.error("Gemini Parsing Error", error);
    return null;
  }
}

/**
 * Answers a user question based on standard society rules (FAQs passed as context).
 */
export async function answerRuleQuestion(question: string, faqs: Array<{question: string, answer: string}>) {
  const context = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  const prompt = `
  You are an AI assistant for a housing society app. 
  Answer the following question simply, in 1-2 sentences, directly to the user.
  Use the context rules below if they contain the answer. 
  If the context doesn't have the exact answer, provide a highly specific, generally standard and helpful response based on typical housing society norms. DO NOT just tell them to contact the office - give them a specific, practical answer.

  Context Rules:
  ${context}

  Question: ${question}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Rulebook Error", error);
    return "Something went wrong. Please connect with the society office.";
  }
}

/**
 * Summarizes recent complaints (Drama Filter)
 */
export async function summarizeComplaints(complaintsText: string[]) {
  const prompt = `
  Here are recent complaints from the housing society:
  ${complaintsText.map((c, i) => `[${i+1}] ${c}`).join('\n')}

  Summerize the drama directly. Return only JSON format:
  {
    "topIssues": ["Issue 1 summary", "Issue 2 summary", "Issue 3 summary"],
    "suggestedActions": ["Action 1", "Action 2"]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const textRes = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (textRes) {
      return JSON.parse(textRes);
    }
    return null;
  } catch (error) {
    console.error("Gemini Summarize Error", error);
    return null;
  }
}
