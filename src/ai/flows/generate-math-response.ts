
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
    description: "Performs basic arithmetic calculations (addition, subtraction, multiplication, division). Input MUST be a valid mathematical expression string (e.g., '25 * 11', '100 / (5 + 5)').",
    inputSchema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate. e.g., '2+2', '100 / (5 * 2)', '25 * 11'. It must be a string that can be directly evaluated."),
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
Your goal is to answer the user's question comprehensively.

If the question involves a direct calculation or can be broken down into steps involving calculations, you MUST use the 'calculator' tool.
Before using the 'calculator' tool, you MUST convert any natural language mathematical phrases into a direct, evaluable mathematical expression string.
For example:
- "what is 25 into 11?" should be converted to the expression "25 * 11" for the tool.
- "sum of 10 and 5" or "10 plus 5" should be converted to "10 + 5".
- "100 divided by 4" should be converted to "100 / 4".
- "what is 2 to the power of 3" could be "2 ** 3".

When you use the 'calculator' tool:
1. Clearly state the natural language part of the question you are about to calculate.
2. State the mathematical expression string you are passing to the tool.
3. State the result obtained from the tool.
4. Incorporate this result into your step-by-step solution or explanation.

If the question is more conceptual and doesn't require calculation (e.g., "What is a prime number?"), then answer it directly without necessarily using the calculator tool.

Question: {{{question}}}

Provide a detailed solution to the question, explaining each step clearly and concisely.
`,
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
