
'use server';

/**
 * @fileOverview This file defines a Genkit flow for a Physics Agent (Physics Pro).
 * This agent is specialized in generating explanations for physics-related questions,
 * can utilize tools to look up physical constants, and now considers conversation history for context.
 *
 * - generatePhysicsExplanation - A function that takes a physics question and history, then returns an explanation.
 * - GeneratePhysicsExplanationInput - The input type for the generatePhysicsExplanation function.
 * - GeneratePhysicsExplanationOutput - The return type for the generatePhysicsExplanation function.
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
 * Defines the expected input schema for the physics explanation generation flow.
 * Now includes conversation history.
 */
const GeneratePhysicsExplanationInputSchema = z.object({
  physicsQuestion: z.string().describe('The physics question to be answered.'),
  history: z.array(MessageHistoryItemSchema).optional().describe('The preceding conversation history, if any. The last message in history is the one immediately preceding the current question.')
});
export type GeneratePhysicsExplanationInput = z.infer<typeof GeneratePhysicsExplanationInputSchema>;

/**
 * Defines the expected output schema for the physics explanation generation flow.
 */
const GeneratePhysicsExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the physics question, including relevant formulas and constants obtained from tools, and considering conversation history.'),
});
export type GeneratePhysicsExplanationOutput = z.infer<typeof GeneratePhysicsExplanationOutputSchema>;

/**
 * A predefined dictionary of common physical constants.
 * Used by the `physicsConstantsTool`.
 */
const PHYSICAL_CONSTANTS: Record<string, { value: number | string; unit: string; name: string }> = {
  'speed of light': { name: 'Speed of Light (c)', value: 299792458, unit: 'm/s' },
  'gravitational constant': { name: 'Gravitational Constant (G)', value: 6.67430e-11, unit: 'N(m/kg)^2' },
  'planck constant': { name: 'Planck Constant (h)', value: 6.62607015e-34, unit: 'J·s' },
  'boltzmann constant': { name: 'Boltzmann Constant (k)', value: 1.380649e-23, unit: 'J/K' },
  'elementary charge': { name: 'Elementary Charge (e)', value: 1.602176634e-19, unit: 'C' },
};

/**
 * Defines a tool for looking up physical constants.
 * The Physics Agent can use this tool to fetch values and units of constants.
 */
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

/**
 * Publicly exported function that invokes the physics explanation generation flow.
 * @param {GeneratePhysicsExplanationInput} input - The physics question and conversation history.
 * @returns {Promise<GeneratePhysicsExplanationOutput>} The generated explanation.
 */
export async function generatePhysicsExplanation(input: GeneratePhysicsExplanationInput): Promise<GeneratePhysicsExplanationOutput> {
  return generatePhysicsExplanationFlow(input);
}

/**
 * Defines the Genkit prompt for the Physics Agent.
 * This prompt instructs the LLM on how to behave as a physics tutor,
 * when to use the `physicsConstantsLookup` tool, and how to use conversation history.
 */
const generatePhysicsExplanationPrompt = ai.definePrompt({
  name: 'generatePhysicsExplanationPrompt',
  input: {schema: GeneratePhysicsExplanationInputSchema},
  output: {schema: GeneratePhysicsExplanationOutputSchema},
  tools: [physicsConstantsTool],
  prompt: `You are an expert physics tutor (Physics Pro).
If the question involves or requires specific physical constants (e.g., speed of light, Planck constant), use the 'physicsConstantsLookup' tool to fetch their values and units.
Clearly state any constants used and their values obtained from the tool in your explanation.
Use the provided conversation history for context if needed.

Conversation History (if any):
{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{else}}
No previous conversation history.
{{/if}}

Current Physics Question: {{{physicsQuestion}}}

Please provide a clear and concise explanation of the physics question.
Your final output MUST be a JSON object structured as {"explanation": "Your clear and concise explanation here"}. Ensure the explanation is a single block of text suitable for a JSON string value.
`,
});

/**
 * Defines the Genkit flow for generating physics explanations.
 * This flow takes a physics question and history, invokes the Physics Agent prompt,
 * and returns the structured explanation. Includes fallback for null or invalid LLM output.
 */
const generatePhysicsExplanationFlow = ai.defineFlow(
  {
    name: 'generatePhysicsExplanationFlow',
    inputSchema: GeneratePhysicsExplanationInputSchema,
    outputSchema: GeneratePhysicsExplanationOutputSchema,
  },
  async (input): Promise<GeneratePhysicsExplanationOutput> => {
    try {
      const { output } = await generatePhysicsExplanationPrompt(input);
      
      if (output === null || typeof output.explanation !== 'string' || output.explanation.trim() === '') {
        console.error(
          `Physics explanation prompt for question "${input.physicsQuestion}" (history: ${JSON.stringify(input.history)}) returned null, invalid, or empty output. ` +
          `LLM Output (if not null): ${output ? JSON.stringify(output) : 'null'}. ` +
          `Falling back to a default error message.`
        );
        return {
          explanation: "I'm sorry, I encountered a hiccup trying to explain that. Could you try rephrasing or asking a different physics question?"
        };
      }
      return output;
    } catch (error) {
      console.error(
        `Error during generatePhysicsExplanationPrompt execution for question "${input.physicsQuestion}" (history: ${JSON.stringify(input.history)}):`, error
      );
      return {
        explanation: "I'm truly stumped on that one! There was an unexpected issue processing your physics question. Please try a different question."
      };
    }
  }
);
