
# TutorVerse 🚀📚

TutorVerse is a friendly and interactive AI-powered learning assistant designed to help students explore the wonders of Math and Physics. It features a multi-agent system where a main Tutor Agent routes queries to specialized Math and Physics sub-agents.
Access it live now on: 
## ✨ Features

*   **Interactive Chat Interface**: Users can ask questions in natural language.
*   **AI-Powered Responses**: Leverages Genkit and Google's Gemini models to provide explanations and solutions.
*   **Multi-Agent Architecture**:
    *   **Tutor Agent (Main)**: Recognizes user intent (Math, Physics, or other).
    *   **Math Agent (Sub-Agent)**: Specializes in math-related questions, equipped with a calculator tool for arithmetic operations.
    *   **Physics Agent (Sub-Agent)**: Specializes in physics-related questions, equipped with a tool to look up physical constants.
*   **Child-Friendly UI**: Designed with a cheerful and engaging theme (Teal, Light Yellow, Orange).
*   **Responsive Design**: Adapts to different screen sizes.
*   **Built with Modern Tech**: Utilizes Next.js, React, ShadCN UI, and Tailwind CSS.
*   **No Authentication Required**: Simplified access for ease of use.

## 🛠️ Tech Stack

*   **Frontend**:
    *   [Next.js](https://nextjs.org/) (with App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
*   **UI Components**:
    *   [ShadCN UI](https://ui.shadcn.com/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **AI/Generative Backend**:
    *   [Genkit (by Google)](https://firebase.google.com/docs/genkit)
    *   Google AI (Gemini models)
*   **Icons**:
    *   [Lucide React](https://lucide.dev/)

## 🧠 Multi-Agent Architecture Design & Principles

TutorVerse is built upon a multi-agent architecture, drawing inspiration from design principles seen in frameworks like Google's Agent Development Kit (ADK) and similar systems. This approach emphasizes modularity, specialized expertise, and tool utilization.

*   **Agent Composition & Communication (Orchestration)**:
    *   **Main Agent (Tutor Agent)**: The primary interface for the user is the Tutor Agent, implemented within `src/app/actions.ts` (specifically the `processUserQuery` function). It receives the student's natural language query.
    *   **Intent Recognition**: The Tutor Agent first communicates with an **Intent Recognition Agent** (the `recognizeIntent` flow in `src/ai/flows/recognize-intent.ts`). This specialized agent analyzes the query to determine its subject matter (e.g., "math," "physics," or "other").
    *   **Delegation to Specialist Sub-Agents**: Based on the recognized intent, the Tutor Agent intelligently delegates the query to the appropriate specialist sub-agent:
        *   **Math Agent**: Handles math-related questions (the `generateMathResponse` flow in `src/ai/flows/generate-math-response.ts`).
        *   **Physics Agent**: Handles physics-related questions (the `generatePhysicsExplanation` flow in `src/ai/flows/generate-physics-explanation.ts`).
    *   This hierarchical structure demonstrates agent composition, where the main agent orchestrates various sub-capabilities. Communication paths are clearly defined for query routing and response aggregation.

*   **Tool Utilization by Specialist Agents**:
    A core principle of effective AI agents is their ability to use tools to augment their capabilities.
    *   The **Math Agent** utilizes a `calculatorTool` to perform arithmetic calculations. This allows it to solve mathematical expressions accurately or verify steps in a problem-solving process.
    *   The **Physics Agent** employs a `physicsConstantsTool` to look up values of common physical constants (e.g., speed of light, Planck constant). This ensures accuracy and enriches its explanations.
    *   Genkit's `ai.defineTool(...)` is used to define these tools, which are then made available to the respective agent prompts, enabling the LLM to decide when and how to use them.

*   **Modularity & Specialization**:
    *   Each agent (intent recognizer, math expert, physics expert) and their tools are encapsulated in separate, modular files (primarily within the `src/ai/flows/` directory).
    *   This promotes a clear separation of concerns, making the system easier to understand, maintain, and extend. For example, a new subject expert (e.g., a Chemistry Agent) could be added with minimal disruption to existing agents.
    *   Genkit's `ai.defineFlow(...)` helps structure these individual agent capabilities.

This architecture allows TutorVerse to handle diverse queries effectively by routing them to agents with the specific knowledge and tools required for the task.

## ⚙️ Setup & Installation

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd tutorverse
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Google AI API Key for Genkit (CRITICAL FOR AI FEATURES)**:
    *   Genkit requires access to a Google AI model (like Gemini) for its AI capabilities.
    *   **Current Setup (Development/Prototyping Only - API Key Hardcoded)**: The `GOOGLE_API_KEY` is currently hardcoded in `src/ai/genkit.ts`. This is done to simplify initial setup in environments where setting environment variables might be challenging. The specific key used is `AIzaSyBfJLoyQHy0NnxTSYQMOwV9D9eKbFY_xwc`.
    *   **SECURITY WARNING**: **For any production deployment or if sharing this code, you MUST remove the hardcoded API key and use environment variables.**
    *   **Recommended Setup (for Production/Secure Use)**:
        1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key if you don't have one.
        2.  **Remove the hardcoded `apiKey` option** from `googleAI(...)` in `src/ai/genkit.ts`. The Genkit `googleAI` plugin will automatically look for `GOOGLE_API_KEY` or `GEMINI_API_KEY` in the environment.
        3.  **In Firebase Studio (or your deployment environment):** Find the section for setting environment variables (often called "Environment Variables," "Secrets," or "Configuration"). Add a new variable:
            *   **Name**: `GOOGLE_API_KEY`
            *   **Value**: `your_google_ai_api_key_from_ai_studio` (Paste your actual key here)
        4.  **For Local Development (outside Firebase Studio):** Create a `.env.local` file in the root of your project (if it doesn't exist) and add:
            ```env
            GOOGLE_API_KEY=your_google_ai_api_key_from_ai_studio
            ```
        5.  **Important**: After setting this environment variable (either in Firebase Studio or locally), you **MUST restart or redeploy** your application for the change to take effect.

## ධ Running the Application

1.  **Start the Development Server (Next.js)**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will usually be available at `http://localhost:9002` (as per your `package.json`).

2.  **Start the Genkit Development Server (Optional, for Genkit UI/Inspector)**:
    If you want to use the Genkit developer UI to inspect flows, traces, etc., run this in a separate terminal:
    ```bash
    npm run genkit:dev
    # or
    # npm run genkit:watch (for auto-reloading on Genkit file changes)
    ```
    The Genkit UI is typically available at `http://localhost:4000`.

## 🎨 UI and Styling

*   The UI is built with **ShadCN UI** components, providing a set of accessible and customizable building blocks.
*   Styling is primarily handled by **Tailwind CSS**, with a custom theme defined in `src/app/globals.css`.
*   The color scheme is designed to be child-friendly:
    *   Background: Light Yellow (`#FFFFE0`)
    *   Primary: Cheerful Teal (`#008080`)
    *   Accent: Bright Orange (`#FFA500`)

## 💡 Genkit

This project uses **Genkit**, an open-source framework from Google, to build AI-powered features. Genkit helps structure, run, and manage AI flows, making it easier to integrate with language models like Gemini. Key Genkit files include:

*   `src/ai/genkit.ts`: Initializes and configures Genkit with the Google AI plugin.
*   `src/ai/flows/`: Contains the definitions for different AI flows (e.g., intent recognition, math response, physics explanation).
*   `src/ai/dev.ts`: Used for local Genkit development (e.g., starting the Genkit developer UI).

---

Made with ❤️ by Nishant Shukla.
TutorVerse can make mistakes. Consider checking important information.
# Tutorverse_Nishant
