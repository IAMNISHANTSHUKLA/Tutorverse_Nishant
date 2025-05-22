
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// --- IMPORTANT API KEY CONFIGURATION ---
// The `googleAI` plugin requires an API key to function.

// OPTION 1 (Recommended for Production & Security): Environment Variable
//   The plugin will automatically look for `GOOGLE_API_KEY` or `GEMINI_API_KEY`
//   in your environment variables if `apiKey` is not explicitly provided here.
//   To set this in Firebase Studio (or your deployment environment):
//   1. Go to your project settings / environment variable configuration.
//   2. Add an environment variable:
//      Name: GOOGLE_API_KEY
//      Value: your_actual_google_ai_api_key
//   3. Restart/redeploy your application.

// OPTION 2 (For Quick Local Prototyping - LESS SECURE): Hardcode the Key
//   If you have trouble with environment variables during local development,
//   you can temporarily hardcode the key.
//   **WARNING**: Do NOT commit hardcoded API keys to public repositories.
//                This is a security risk.
//   To use the hardcoded key, uncomment the line below and replace with your key.
const GOOGLE_API_KEY_HARDCODED = "AIzaSyBfJLoyQHy0NnxTSYQMOwV9D9eKbFY_xwc"; // Replace with your key if using this method

/**
 * Initializes and configures the Genkit AI instance.
 * It sets up the Google AI plugin.
 * It attempts to use the hardcoded API key for simplicity in this development environment.
 * For production, environment variables are strongly recommended.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      // Using the hardcoded key for now to ensure functionality in the current setup.
      // For production or if sharing code, REMOVE THIS and use environment variables.
      apiKey: GOOGLE_API_KEY_HARDCODED,
      // To use environment variables (Option 1 - recommended for production),
      // comment out or remove the `apiKey` line above.
      // The plugin will then automatically look for GOOGLE_API_KEY or GEMINI_API_KEY in process.env.
    })
  ],
  // Set a default model for the AI instance.
  // Specific flows/prompts can override this if needed.
  model: 'googleai/gemini-1.5-flash-latest',
});
