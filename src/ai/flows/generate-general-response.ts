
'use server';
/**
 * @fileOverview A general question answering AI agent.
 * This flow is responsible for providing brief, helpful answers to general queries
 * that don't fall under Math or Physics. It considers conversation history for context.
 *
 * - generateGeneralResponse - A function that handles the general question answering process.
 * - GenerateGeneralResponseInput - The input type for the generateGeneralResponse function.
 * - GenerateGeneralResponseOutput - The return type for the generateGeneralResponse function.
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
 * Defines the expected input schema for the general response generation flow.
 */
const GenerateGeneralResponseInputSchema = z.object({
  query: z.string().describe('The general question to be answered.'),
  history: z.array(MessageHistoryItemSchema).optional().describe('The preceding conversation history, if any. The last message in history is the one immediately preceding the current question.')
});
export type GenerateGeneralResponseInput = z.infer<typeof GenerateGeneralResponseInputSchema>;

/**
 * Defines the expected output schema for the general response generation flow.
 */
const GenerateGeneralResponseOutputSchema = z.object({
  response: z.string().describe('A brief, general, and helpful answer to the query.'),
});
export type GenerateGeneralResponseOutput = z.infer<typeof GenerateGeneralResponseOutputSchema>;

/**
 * Publicly exported function that invokes the general response generation flow.
 * @param {GenerateGeneralResponseInput} input - The user's query and conversation history.
 * @returns {Promise<GenerateGeneralResponseOutput>} The generated general answer.
 */
export async function generateGeneralResponse(input: GenerateGeneralResponseInput): Promise<GenerateGeneralResponseOutput> {
  return generateGeneralResponseFlow(input);
}

/**
 * Defines the Genkit prompt for the General Response Agent.
 * This prompt instructs the LLM on how to behave for general queries.
 */
const generateGeneralResponsePrompt = ai.definePrompt({
  name: 'generateGeneralResponsePrompt',
  input: {schema: GenerateGeneralResponseInputSchema},
  output: {schema: GenerateGeneralResponseOutputSchema},
  prompt: `You are a helpful assistant for TutorVerse. TutorVerse primarily specializes in Math and Physics.
The user has asked a question that is not specifically about Math or Physics.

Conversation History (if any):
{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{else}}
No previous conversation history.
{{/if}}

Current User Query: {{{query}}}

Please provide a brief, general, and helpful answer to the user's query.
If the question is completely nonsensical, unanswerable, or inappropriate, politely state that you cannot answer it.
Keep your answer concise. Your final output MUST be a JSON object structured as {"response": "Your brief answer here"}.
`,
});

/**
 * Defines the Genkit flow for generating general responses.
 * This flow takes a query and history, invokes the prompt,
 * and returns the structured answer. It includes error handling for null outputs from the LLM.
 */
const generateGeneralResponseFlow = ai.defineFlow(
  {
    name: 'generateGeneralResponseFlow',
    inputSchema: GenerateGeneralResponseInputSchema,
    outputSchema: GenerateGeneralResponseOutputSchema,
  },
  async (input): Promise<GenerateGeneralResponseOutput> => {
    const { output } = await generateGeneralResponsePrompt(input);

    if (output === null) {
      console.error(
        `General response prompt for query "${input.query}" (with history) returned null output. ` +
        `This means the LLM failed to generate a response that conforms to the expected schema. ` +
        `Falling back to a default message.`
      );
      return {
        response: "I'm not quite sure how to answer that. Perhaps you could try asking a specific Math or Physics question?"
      };
    }
    return output;
  }
);
