import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// WARNING: It is strongly recommended to use environment variables for API keys in production.
// This key is hardcoded for development/prototyping purposes only.
// For production, remove the apiKey from here and set the GOOGLE_API_KEY environment variable.
const GOOGLE_API_KEY = "AIzaSyBfJLoyQHy0NnxTSYQMOwV9D9eKbFY_xwc";

export const ai = genkit({
  plugins: [
    googleAI(
      GOOGLE_API_KEY 
        ? { apiKey: GOOGLE_API_KEY } 
        : undefined // If the key were empty, let googleAI try to find it via env var
    )
  ],
  model: 'googleai/gemini-2.0-flash',
});
