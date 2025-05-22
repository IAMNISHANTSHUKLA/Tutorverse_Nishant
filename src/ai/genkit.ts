import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI plugin will automatically look for GOOGLE_API_KEY 
// (or GEMINI_API_KEY) in your environment variables.
// Ensure GOOGLE_API_KEY is set in your deployment environment (e.g., Firebase Studio project settings).
export const ai = genkit({
  plugins: [
    googleAI() // No explicit apiKey here; it will use the environment variable.
  ],
  // You can set a default model for your AI instance if desired
  // model: 'googleai/gemini-1.5-flash-latest', 
  // However, specific flows/prompts can override this.
});
