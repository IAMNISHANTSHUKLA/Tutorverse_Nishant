
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
  answer: z.string().describe('The step-by-step solution or explanation to the math question, incorporating any calculations performed.'),
});
export type GenerateMathResponseOutput = z.infer<typeof GenerateMathResponseOutputSchema>;

// Define the calculator tool
const calculatorTool = ai.defineTool(
  {
    name: 'calculator',
    description: 'Performs basic arithmetic calculations (addition, subtraction, multiplication, division). Input should be a valid mathematical expression as a string.',
    inputSchema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate. e.g., '2+2', '100 / (5 * 2)'"),
    }),
    outputSchema: z.object({
      result: z.string().describe("The result of the calculation as a string, or an error message if evaluation failed (e.g., 'Error: Division by zero')."),
    }),
  },
  async (input) => {
    try {
      // WARNING: eval() is used for simplicity. In a production environment,
      // use a safer math expression parser.
      const result = eval(input.expression);
      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return { result: `Error: Invalid expression or result (${result})` };
      }
      return { result: result.toString() };
    } catch (error: any) {
      return { result: `Error: ${error.message || 'Calculation failed'}` };
    }
  }
);

export async function generateMathResponse(input: GenerateMathResponseInput): Promise<GenerateMathResponseOutput> {
  return generateMathResponseFlow(input);
}

const generateMathResponsePrompt = ai.definePrompt({
  name: 'generateMathResponsePrompt',
  input: {schema: GenerateMathResponseInputSchema},
  output: {schema: GenerateMathResponseOutputSchema},
  tools: [calculatorTool], // Make the tool available to the prompt
  prompt: `You are an expert math tutor who specializes in providing step-by-step solutions and explanations to math questions.
  When a calculation is needed to solve a part of the problem or to verify a step, use the 'calculator' tool.
  Clearly state the calculation being performed and its result from the tool.

  Question: {{{question}}}

  Provide a detailed solution to the question, explaining each step clearly and concisely. If you use the calculator, state the expression and its result.`,
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
