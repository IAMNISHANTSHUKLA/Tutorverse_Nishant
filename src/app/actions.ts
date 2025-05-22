'use server';

import { recognizeIntent, type RecognizeIntentOutput } from '@/ai/flows/recognize-intent';
import { generateMathResponse, type GenerateMathResponseOutput } from '@/ai/flows/generate-math-response';
import { generatePhysicsExplanation, type GeneratePhysicsExplanationOutput } from '@/ai/flows/generate-physics-explanation';

export interface ProcessedResponse {
  intent: 'math' | 'physics' | 'other' | 'error';
  text: string;
}

export async function processUserQuery(query: string): Promise<ProcessedResponse> {
  if (!query.trim()) {
    return { intent: 'error', text: "Please enter a question." };
  }

  try {
    const intentResult: RecognizeIntentOutput = await recognizeIntent({ query });
    
    switch (intentResult.intent) {
      case 'math':
        const mathResult: GenerateMathResponseOutput = await generateMathResponse({ question: query });
        return { intent: 'math', text: mathResult.answer };
      case 'physics':
        const physicsResult: GeneratePhysicsExplanationOutput = await generatePhysicsExplanation({ physicsQuestion: query });
        return { intent: 'physics', text: physicsResult.explanation };
      case 'other':
      default: // Includes 'other' and any unexpected intents
        return { 
          intent: 'other', 
          text: "I specialize in Math and Physics! Try asking me a question like 'What is Newton's second law?' or 'Solve 2x + 5 = 11'." 
        };
    }
  } catch (error) {
    console.error("Error processing query:", error);
    // Check if error is an object and has a message property
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) ? String(error.message) : "Unknown error";
    return { 
      intent: 'error', 
      text: `Sorry, I encountered an error trying to process your request. Please try again.\nDetails: ${errorMessage}`
    };
  }
}
