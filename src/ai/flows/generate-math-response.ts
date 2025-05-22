// Implemented the Genkit flow for generating responses to math questions.
'use server';
/**
 * @fileOverview A math question answering AI agent.
 *
 * - generateMathResponse - A function that handles the math question answering process.
 * - GenerateMathResponseInput - The input type for the generateMathResponse function.
 * - GenerateMathResponseOutput - The return type for the generateMathResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMathResponseInputSchema = z.object({
  question: z.string().describe('The math question to be answered.'),
});
export type GenerateMathResponseInput = z.infer<typeof GenerateMathResponseInputSchema>;

const GenerateMathResponseOutputSchema = z.object({
  answer: z.string().describe('The step-by-step solution or explanation to the math question.'),
});
export type GenerateMathResponseOutput = z.infer<typeof GenerateMathResponseOutputSchema>;

export async function generateMathResponse(input: GenerateMathResponseInput): Promise<GenerateMathResponseOutput> {
  return generateMathResponseFlow(input);
}

const generateMathResponsePrompt = ai.definePrompt({
  name: 'generateMathResponsePrompt',
  input: {schema: GenerateMathResponseInputSchema},
  output: {schema: GenerateMathResponseOutputSchema},
  prompt: `You are an expert math tutor who specializes in providing step-by-step solutions and explanations to math questions.

  Question: {{{question}}}

  Provide a detailed solution to the question, explaining each step clearly and concisely.`,
});

const generateMathResponseFlow = ai.defineFlow(
  {
    name: 'generateMathResponseFlow',
    inputSchema: GenerateMathResponseInputSchema,
    outputSchema: GenerateMathResponseOutputSchema,
  },
  async input => {
    const {output} = await generateMathResponsePrompt(input);
    return output!;
  }
);
