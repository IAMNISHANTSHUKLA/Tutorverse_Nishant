
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-physics-explanation.ts';
import '@/ai/flows/recognize-intent.ts';
import '@/ai/flows/generate-math-response.ts';
import '@/ai/flows/generate-general-response.ts'; // Added new flow
