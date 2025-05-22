import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI plugin will automatically look for GOOGLE_API_KEY 
// (or GEMINI_API_KEY) in your environment variables if apiKey is not provided.

// IMPORTANT: For production, it is STRONGLY recommended to use environment variables.
// For development/prototyping, if environment variables are problematic,
// you can temporarily hardcode the key here.
const GOOGLE_API_KEY = "AIzaSyBfJLoyQHy0NnxTSYQMOwV9D9eKbFY_xwc"; // This key is currently hardcoded.

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: GOOGLE_API_KEY // Directly using the hardcoded API key
    })
  ],
  // Set a default model for the AI instance.
  // Specific flows/prompts can override this if needed.
  model: 'googleai/gemini-1.5-flash-latest', 
});
