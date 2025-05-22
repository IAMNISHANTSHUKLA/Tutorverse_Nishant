
'use server';

/**
 * @fileOverview Recognizes the intent of a user's query to route it to the appropriate expert agent.
 * This flow acts as an intent classification agent.
 *
 * - recognizeIntent - A function that takes a user's question and returns the identified intent.
 * - RecognizeIntentInput - The input type for the recognizeIntent function.
 * - RecognizeIntentOutput - The return type for the recognizeIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the expected input schema for the intent recognition flow.
 */
const RecognizeIntentInputSchema = z.object({
  query: z.string().describe('The user query to analyze.'),
});
export type RecognizeIntentInput = z.infer<typeof RecognizeIntentInputSchema>;

/**
 * Defines the expected output schema for the intent recognition flow.
 * The intent can be 'math', 'physics', or 'other'.
 */
const RecognizeIntentOutputSchema = z.object({
  intent: z.enum(['math', 'physics', 'other']).describe('The identified intent of the query.'),
});
export type RecognizeIntentOutput = z.infer<typeof RecognizeIntentOutputSchema>;

/**
 * Publicly exported function that invokes the intent recognition flow.
 * @param {RecognizeIntentInput} input - The user's query.
 * @returns {Promise<RecognizeIntentOutput>} The identified intent.
 */
export async function recognizeIntent(input: RecognizeIntentInput): Promise<RecognizeIntentOutput> {
  return recognizeIntentFlow(input);
}

/**
 * Defines the Genkit prompt for intent recognition.
 * This prompt instructs the LLM to classify the user's query.
 */
const recognizeIntentPrompt = ai.definePrompt({
  name: 'recognizeIntentPrompt',
  input: {schema: RecognizeIntentInputSchema},
  output: {schema: RecognizeIntentOutputSchema},
  prompt: `Analyze the following user query and determine its intent. The intent should be one of the following: "math", "physics", or "other".\n\nQuery: {{{query}}}\n\nIntent:`,
});

/**
 * Defines the Genkit flow for recognizing user intent.
 * This flow takes a user query, invokes the intent recognition prompt,
 * and returns the structured intent.
 */
const recognizeIntentFlow = ai.defineFlow(
  {
    name: 'recognizeIntentFlow',
    inputSchema: RecognizeIntentInputSchema,
    outputSchema: RecognizeIntentOutputSchema,
  },
  async input => {
    const {output} = await recognizeIntentPrompt(input);
    // Assume output will conform to schema if not null.
    return output!;
  }
);
