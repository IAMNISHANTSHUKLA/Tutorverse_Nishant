// recognize-intent.ts
'use server';

/**
 * @fileOverview Recognizes the intent of a user's question to route it to the appropriate expert agent.
 *
 * - recognizeIntent - A function that takes a user's question and returns the identified intent.
 * - RecognizeIntentInput - The input type for the recognizeIntent function.
 * - RecognizeIntentOutput - The return type for the recognizeIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeIntentInputSchema = z.object({
  query: z.string().describe('The user query to analyze.'),
});

export type RecognizeIntentInput = z.infer<typeof RecognizeIntentInputSchema>;

const RecognizeIntentOutputSchema = z.object({
  intent: z.enum(['math', 'physics', 'other']).describe('The identified intent of the query.'),
});

export type RecognizeIntentOutput = z.infer<typeof RecognizeIntentOutputSchema>;

export async function recognizeIntent(input: RecognizeIntentInput): Promise<RecognizeIntentOutput> {
  return recognizeIntentFlow(input);
}

const recognizeIntentPrompt = ai.definePrompt({
  name: 'recognizeIntentPrompt',
  input: {schema: RecognizeIntentInputSchema},
  output: {schema: RecognizeIntentOutputSchema},
  prompt: `Analyze the following user query and determine its intent. The intent should be one of the following: "math", "physics", or "other".\n\nQuery: {{{query}}}\n\nIntent:`,
});

const recognizeIntentFlow = ai.defineFlow(
  {
    name: 'recognizeIntentFlow',
    inputSchema: RecognizeIntentInputSchema,
    outputSchema: RecognizeIntentOutputSchema,
  },
  async input => {
    const {output} = await recognizeIntentPrompt(input);
    return output!;
  }
);
