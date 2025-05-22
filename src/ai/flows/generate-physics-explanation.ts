// src/ai/flows/generate-physics-explanation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating physics explanations.
 *
 * - generatePhysicsExplanation - A function that takes a physics question as input and returns a clear and concise explanation.
 * - GeneratePhysicsExplanationInput - The input type for the generatePhysicsExplanation function.
 * - GeneratePhysicsExplanationOutput - The return type for the generatePhysicsExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhysicsExplanationInputSchema = z.object({
  physicsQuestion: z.string().describe('The physics question to be answered.'),
});
export type GeneratePhysicsExplanationInput = z.infer<typeof GeneratePhysicsExplanationInputSchema>;

const GeneratePhysicsExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the physics question, including relevant formulas and constants.'),
});
export type GeneratePhysicsExplanationOutput = z.infer<typeof GeneratePhysicsExplanationOutputSchema>;


export async function generatePhysicsExplanation(input: GeneratePhysicsExplanationInput): Promise<GeneratePhysicsExplanationOutput> {
  return generatePhysicsExplanationFlow(input);
}

const generatePhysicsExplanationPrompt = ai.definePrompt({
  name: 'generatePhysicsExplanationPrompt',
  input: {schema: GeneratePhysicsExplanationInputSchema},
  output: {schema: GeneratePhysicsExplanationOutputSchema},
  prompt: `You are an expert physics tutor. Please provide a clear and concise explanation of the following physics question, including relevant formulas and constants:

{{{physicsQuestion}}}`, 
});

const generatePhysicsExplanationFlow = ai.defineFlow(
  {
    name: 'generatePhysicsExplanationFlow',
    inputSchema: GeneratePhysicsExplanationInputSchema,
    outputSchema: GeneratePhysicsExplanationOutputSchema,
  },
  async input => {
    const {output} = await generatePhysicsExplanationPrompt(input);
    return output!;
  }
);
