
'use server';

/**
 * @fileOverview Recognizes the intent of a user's query to route it to the appropriate expert agent.
 * This flow acts as an intent classification agent and now considers conversation history.
 *
 * - recognizeIntent - A function that takes a user's question and conversation history, then returns the identified intent.
 * - RecognizeIntentInput - The input type for the recognizeIntent function.
 * - RecognizeIntentOutput - The return type for the recognizeIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines a schema for a single message in the conversation history.
 */
const MessageHistoryItemSchema = z.object({
  role: z.enum(['user', 'assistant']).describe("The role of the speaker in this message (user or assistant)."),
  content: z.string().describe("The text content of the message.")
});

/**
 * Defines the expected input schema for the intent recognition flow.
 * It now includes the current query and the conversation history.
 */
const RecognizeIntentInputSchema = z.object({
  query: z.string().describe('The user query to analyze.'),
  history: z.array(MessageHistoryItemSchema).optional().describe('The preceding conversation history, if any. The last message in history is the one immediately preceding the current query.')
});
export type RecognizeIntentInput = z.infer<typeof RecognizeIntentInputSchema>;

/**
 * Defines the expected output schema for the intent recognition flow.
 * The intent can be 'math', 'physics', or 'other'.
 */
const RecognizeIntentOutputSchema = z.object({
  intent: z.enum(['math', 'physics', 'other']).describe('The identified intent of the query (math, physics, or other).'),
});
export type RecognizeIntentOutput = z.infer<typeof RecognizeIntentOutputSchema>;

/**
 * Publicly exported function that invokes the intent recognition flow.
 * @param {RecognizeIntentInput} input - The user's query and conversation history.
 * @returns {Promise<RecognizeIntentOutput>} The identified intent.
 */
export async function recognizeIntent(input: RecognizeIntentInput): Promise<RecognizeIntentOutput> {
  return recognizeIntentFlow(input);
}

/**
 * Defines the Genkit prompt for intent recognition.
 * This prompt instructs the LLM to classify the user's query, considering the conversation history.
 */
const recognizeIntentPrompt = ai.definePrompt({
  name: 'recognizeIntentPrompt',
  input: {schema: RecognizeIntentInputSchema},
  output: {schema: RecognizeIntentOutputSchema},
  prompt: `You are an intent recognition agent. Your task is to analyze the user's current query and the preceding conversation history to determine the primary subject focus.
The intent should be one of "math", "physics", or "other".
Consider the immediate query first, but use the history to disambiguate if needed. For example, if the user asks "what about its formula?" after a discussion on gravity, the intent is "physics".

Conversation History (if any):
{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{else}}
No previous conversation history.
{{/if}}

Current User Query: {{{query}}}

Based on the current query and the history, determine the intent.
Intent:`,
});

/**
 * Defines the Genkit flow for recognizing user intent.
 * This flow takes a user query and history, invokes the intent recognition prompt,
 * and returns the structured intent. It includes a fallback if the prompt returns null.
 */
const recognizeIntentFlow = ai.defineFlow(
  {
    name: 'recognizeIntentFlow',
    inputSchema: RecognizeIntentInputSchema,
    outputSchema: RecognizeIntentOutputSchema,
  },
  async (input): Promise<RecognizeIntentOutput> => {
    const { output } = await recognizeIntentPrompt(input);
    
    if (output === null) {
      console.error(
        `Intent recognition prompt for query "${input.query}" returned null output. ` +
        `This means the LLM failed to generate a response that conforms to the expected schema. ` +
        `Falling back to 'other' intent.`
      );
      return { intent: 'other' }; // Fallback intent
    }
    return output;
  }
);
