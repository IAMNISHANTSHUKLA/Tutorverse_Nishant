
'use server';

/**
 * @fileOverview This file defines a Genkit flow for a Physics Agent.
 * This agent is specialized in generating explanations for physics-related questions and can utilize tools to look up physical constants.
 *
 * - generatePhysicsExplanation - A function that takes a physics question as input and returns a clear and concise explanation from the Physics Agent.
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
  explanation: z.string().describe('A clear and concise explanation of the physics question, including relevant formulas and constants obtained from tools.'),
});
export type GeneratePhysicsExplanationOutput = z.infer<typeof GeneratePhysicsExplanationOutputSchema>;

const PHYSICAL_CONSTANTS: Record<string, { value: number | string; unit: string; name: string }> = {
  'speed of light': { name: 'Speed of Light (c)', value: 299792458, unit: 'm/s' },
  'gravitational constant': { name: 'Gravitational Constant (G)', value: 6.67430e-11, unit: 'N(m/kg)^2' },
  'planck constant': { name: 'Planck Constant (h)', value: 6.62607015e-34, unit: 'J·s' },
  'boltzmann constant': { name: 'Boltzmann Constant (k)', value: 1.380649e-23, unit: 'J/K' },
  'elementary charge': { name: 'Elementary Charge (e)', value: 1.602176634e-19, unit: 'C' },
};

const physicsConstantsTool = ai.defineTool(
  {
    name: 'physicsConstantsLookup',
    description: 'Looks up the value and unit of a common physical constant.',
    inputSchema: z.object({
      constantName: z.string().describe("The common name of the physical constant to look up (e.g., 'speed of light', 'planck constant'). Should be lowercase."),
    }),
    outputSchema: z.object({
      name: z.string().describe("The official name of the constant."),
      value: z.string().describe("Value of the constant as a string, or 'Constant not found' if unavailable."),
      unit: z.string().optional().describe("Unit of the constant, if applicable."),
    }),
  },
  async (input) => {
    const normalizedName = input.constantName.toLowerCase();
    const constant = PHYSICAL_CONSTANTS[normalizedName];
    if (constant) {
      return { name: constant.name, value: constant.value.toString(), unit: constant.unit };
    }
    return { name: input.constantName, value: 'Constant not found', unit: undefined };
  }
);

export async function generatePhysicsExplanation(input: GeneratePhysicsExplanationInput): Promise<GeneratePhysicsExplanationOutput> {
  return generatePhysicsExplanationFlow(input);
}

const generatePhysicsExplanationPrompt = ai.definePrompt({
  name: 'generatePhysicsExplanationPrompt',
  input: {schema: GeneratePhysicsExplanationInputSchema},
  output: {schema: GeneratePhysicsExplanationOutputSchema},
  tools: [physicsConstantsTool], // Make the tool available
  prompt: `You are an expert physics tutor (Physics Agent). Please provide a clear and concise explanation of the following physics question.
  If the question involves or requires specific physical constants (e.g., speed of light, Planck constant), use the 'physicsConstantsLookup' tool to fetch their values and units.
  Clearly state any constants used and their values obtained from the tool in your explanation.

Physics Question: {{{physicsQuestion}}}

Explanation:`,
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

    