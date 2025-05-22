
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
    description: "Performs basic arithmetic calculations (addition, subtraction, multiplication, division). Input MUST be a valid mathematical expression string (e.g., '25 * 11', '100 / (5 + 5)', '15 - (5 + 2 + 3)'). This tool evaluates mathematical expressions.",
    inputSchema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate. e.g., '2+2', '100 / (5 * 2)', '25 * 11', '15 - (5 + 2 + 3)'. It must be a string that can be directly evaluated."),
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
Before using the 'calculator' tool, you MUST convert any natural language mathematical phrases or word problems into a direct, evaluable mathematical expression string.

For simple conversions:
- "what is 25 into 11?" should be converted to the expression "25 * 11" for the tool.
- "sum of 10 and 5" or "10 plus 5" should be converted to "10 + 5".
- "100 divided by 4" should be converted to "100 / 4".
- "what is 2 to the power of 3" could be "2 ** 3".

For word problems, carefully analyze the problem to identify the numbers and the operations required. Formulate a mathematical expression that solves the problem.
For instance, if the question is: "suppose nishant has 15 apples, of which he gave 5 to shrish, 2 to gaurav and 3 to vansh, please get me how many apples is nishant left with"
You should:
1.  Understand Nishant starts with 15 apples.
2.  Calculate the total apples given away: 5 (to Shrish) + 2 (to Gaurav) + 3 (to Vansh).
3.  Formulate the expression to find the remaining apples: 15 - (5 + 2 + 3).
4.  Use the calculator tool with the expression "15 - (5 + 2 + 3)".
5.  Explain these steps and the final answer based on the tool's result.

When you use the 'calculator' tool:
1. Clearly state the natural language part of the question or the setup of the word problem you are about to calculate.
2. State the mathematical expression string you are passing to the tool.
3. State the result obtained from the tool.
4. Incorporate this result into your step-by-step solution or explanation.

If the question is more conceptual and doesn't require calculation (e.g., "What is a prime number?"), then answer it directly without necessarily using the calculator tool.

Question: {{{question}}}

Provide a detailed solution to the question, explaining each step clearly and concisely. Your final output MUST be a JSON object structured as {"answer": "Your detailed explanation here"}.
`,
});

const generateMathResponseFlow = ai.defineFlow(
  {
    name: 'generateMathResponseFlow',
    inputSchema: GenerateMathResponseInputSchema,
    outputSchema: GenerateMathResponseOutputSchema,
  },
  async (input): Promise<GenerateMathResponseOutput> => {
    const { output } = await generateMathResponsePrompt(input);

    if (output === null) {
      console.error(
        `Math response prompt for question "${input.question}" returned null output. ` +
        `This means the LLM failed to generate a response that conforms to the expected schema. ` +
        `Falling back to a default error message.`
      );
      return {
        answer: "I'm sorry, I wasn't able to generate a response for your math question. " +
                "This might be due to the complexity or phrasing of the question. Please try rephrasing or asking a different question."
      };
    }
    // If output is not null, it should conform to GenerateMathResponseOutputSchema
    // as per the definePrompt definition.
    return output;
  }
);
