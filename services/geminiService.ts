
import { GoogleGenAI } from "@google/genai";
import { AIResponse, GroundingChunk } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure it is set in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeResumeMatch = async (resume: string, jobDesc: string): Promise<AIResponse> => {
  const ai = getAIClient();
  const prompt = `
    Act as a senior technical recruiter and career coach.
    Analyze the provided resume against the job description.
    
    Output requirements (Markdown ONLY):
    1. # Match Score: [Score]%
    2. ## Top Matching Skills (List 3-5 keywords found in both)
    3. ## Missing Requirements (List specific technical skills or experience gaps)
    4. ## Optimized Bullet Points (Rewrite 2 points from the resume to better target the Job Description keywords)
    5. ## Strategic Advice (A short paragraph on how to land the interview)

    --- RESUME ---
    ${resume}
    
    --- JOB DESCRIPTION ---
    ${jobDesc}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });

  return {
    text: response.text || "Analysis failed."
  };
};

export const generateCareerRoadmap = async (targetRole: string): Promise<AIResponse> => {
  const ai = getAIClient();
  const prompt = `
    Create a comprehensive, 12-month career transition roadmap for becoming a ${targetRole}.
    Break it down into:
    - Phase 1: Foundations (Months 1-3)
    - Phase 2: Technical Deep Dive (Months 4-7)
    - Phase 3: Project Building & Portfolio (Months 8-10)
    - Phase 4: Job Market Strategy (Months 11-12)
    
    Include specific tools, certifications, and high-impact projects for each phase.
    Use professional Markdown with clear headers and lists.
    Search for current industry trends to make it accurate.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  // Fix: Explicitly cast the grounding chunks from the Google GenAI SDK to our local type to resolve type mismatch errors.
  return {
    text: response.text || "Failed to generate roadmap.",
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined
  };
};

export const generateInterviewGuide = async (role: string): Promise<AIResponse> => {
  const ai = getAIClient();
  const prompt = `
    Generate a high-intensity interview prep guide for the role of: ${role}.
    Include:
    1. Top 5 Technical Questions (and how to answer them).
    2. 3 Behavioral Questions using the STAR method.
    3. Industry Trends (Recent news or shifts relevant to this role).
    4. Preparation Checklist.
    
    Use professional Markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  // Fix: Explicitly cast the grounding chunks from the Google GenAI SDK to our local type to resolve type mismatch errors.
  return {
    text: response.text || "Failed to generate guide.",
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined
  };
};
