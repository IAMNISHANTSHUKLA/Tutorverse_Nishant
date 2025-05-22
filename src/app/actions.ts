
'use server';

import { recognizeIntent, type RecognizeIntentOutput } from '@/ai/flows/recognize-intent';
import { generateMathResponse, type GenerateMathResponseOutput } from '@/ai/flows/generate-math-response';
import { generatePhysicsExplanation, type GeneratePhysicsExplanationOutput } from '@/ai/flows/generate-physics-explanation';

/**
 * Interface for the structured response returned by `processUserQuery`.
 * It includes the identified intent and the textual response from the AI.
 */
export interface ProcessedResponse {
  intent: 'math' | 'physics' | 'other' | 'error';
  text: string;
}

/**
 * Processes a user's query by first recognizing its intent and then
 * delegating to the appropriate specialist AI agent (Math or Physics).
 * This function acts as the main orchestrator or "Tutor Agent".
 *
 * @param {string} query - The user's natural language query.
 * @returns {Promise<ProcessedResponse>} An object containing the intent and the AI's textual response.
 */
export async function processUserQuery(query: string): Promise<ProcessedResponse> {
  if (!query.trim()) {
    return { intent: 'error', text: "Please enter a question." };
  }

  try {
    // Step 1: Recognize the intent of the user's query.
    const intentResult: RecognizeIntentOutput = await recognizeIntent({ query });
    
    // Step 2: Delegate to the appropriate specialist agent based on the intent.
    switch (intentResult.intent) {
      case 'math':
        const mathResult: GenerateMathResponseOutput = await generateMathResponse({ question: query });
        return { intent: 'math', text: mathResult.answer };
      case 'physics':
        const physicsResult: GeneratePhysicsExplanationOutput = await generatePhysicsExplanation({ physicsQuestion: query });
        return { intent: 'physics', text: physicsResult.explanation };
      case 'other':
      default: // Includes 'other' and any unexpected intents.
        return { 
          intent: 'other', 
          text: "I specialize in Math and Physics! Try asking me a question like 'What is Newton's second law?' or 'Solve 2x + 5 = 11'." 
        };
    }
  } catch (error) {
    console.error("Error processing query:", error);
    // Provide a user-friendly error message.
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) ? String(error.message) : "Unknown error";
    return { 
      intent: 'error', 
      text: `Sorry, I encountered an error trying to process your request. Please try again.\nDetails: ${errorMessage}`
    };
  }
}
