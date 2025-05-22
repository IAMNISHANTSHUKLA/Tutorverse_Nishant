
'use server';

import { recognizeIntent, type RecognizeIntentOutput, type RecognizeIntentInput } from '@/ai/flows/recognize-intent';
import { generateMathResponse, type GenerateMathResponseOutput, type GenerateMathResponseInput } from '@/ai/flows/generate-math-response';
import { generatePhysicsExplanation, type GeneratePhysicsExplanationOutput, type GeneratePhysicsExplanationInput } from '@/ai/flows/generate-physics-explanation';

/**
 * Defines the structure of a message item as expected by the AI flows for history.
 */
export interface HistoryMessageForFlow {
  role: 'user' | 'assistant';
  content: string;
}

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
 * It now accepts conversation history to provide context to the AI agents.
 *
 * @param {string} currentQuery - The user's current natural language query.
 * @param {HistoryMessageForFlow[]} history - An array of previous messages in the conversation.
 * @returns {Promise<ProcessedResponse>} An object containing the intent and the AI's textual response.
 */
export async function processUserQuery(currentQuery: string, history: HistoryMessageForFlow[]): Promise<ProcessedResponse> {
  if (!currentQuery.trim()) {
    return { intent: 'error', text: "Please enter a question." };
  }

  try {
    // Step 1: Recognize the intent of the user's query, considering conversation history.
    const intentInput: RecognizeIntentInput = { query: currentQuery, history: history };
    const intentResult: RecognizeIntentOutput = await recognizeIntent(intentInput);
    
    // Step 2: Delegate to the appropriate specialist agent based on the intent.
    switch (intentResult.intent) {
      case 'math':
        const mathInput: GenerateMathResponseInput = { question: currentQuery, history: history };
        const mathResult: GenerateMathResponseOutput = await generateMathResponse(mathInput);
        return { intent: 'math', text: mathResult.answer };
      case 'physics':
        const physicsInput: GeneratePhysicsExplanationInput = { physicsQuestion: currentQuery, history: history };
        const physicsResult: GeneratePhysicsExplanationOutput = await generatePhysicsExplanation(physicsInput);
        return { intent: 'physics', text: physicsResult.explanation };
      case 'other':
      default: // Includes 'other' and any unexpected intents.
        return { 
          intent: 'other', 
          text: "I specialize in Math and Physics! You can ask me questions like 'What is Newton's second law?' or 'Solve 2x + 5 = 11'. I can also try to remember what we talked about before." 
        };
    }
  } catch (error) {
    console.error("Error processing query:", error);
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) ? String(error.message) : "Unknown error";
    return { 
      intent: 'error', 
      text: `Sorry, I encountered an error trying to process your request. Please try again.\nDetails: ${errorMessage}`
    };
  }
}
