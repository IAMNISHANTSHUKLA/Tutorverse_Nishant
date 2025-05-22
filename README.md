
# TutorVerse 🚀📚

TutorVerse is a friendly and interactive AI-powered learning assistant designed to help students explore the wonders of Math and Physics. It features a multi-agent system where a main Tutor Agent routes queries to specialized Math and Physics sub-agents.

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

3.  **Google AI API Key for Genkit**:
    *   Genkit requires access to a Google AI model (like Gemini).
    *   **Important**: The Google AI API Key is currently **hardcoded** in `src/ai/genkit.ts` for ease of initial setup in development environments like Firebase Studio.
        ```typescript
        // src/ai/genkit.ts
        const GOOGLE_API_KEY = "YOUR_API_KEY_IS_CURRENTLY_HERE"; 
        // ...
        googleAI({ apiKey: GOOGLE_API_KEY })
        // ...
        ```
    *   **For Production**: It is **strongly recommended** to remove the hardcoded API key from `src/ai/genkit.ts` and instead set it as an environment variable. To do this:
        1.  Remove or comment out the `const GOOGLE_API_KEY = "...";` line and the direct `apiKey` provision in `src/ai/genkit.ts`. The `googleAI()` plugin will then automatically look for the `GOOGLE_API_KEY` environment variable.
        2.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key if you don't have one.
        3.  Set this API key as an environment variable named `GOOGLE_API_KEY` in your deployment environment (e.g., Firebase Studio project settings, or a `.env` / `.env.local` file for local development if you switch back to env vars).
            ```env
            GOOGLE_API_KEY=your_google_ai_api_key_from_ai_studio
            ```

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

## 🧠 Multi-Agent Architecture

The core AI functionality is built around a multi-agent system:

*   **Main Tutor Agent (`src/app/actions.ts`)**: Receives the user's query and uses an intent recognition flow (`src/ai/flows/recognize-intent.ts`) to determine if the query is related to "math," "physics," or "other."
*   **Math Agent (`src/ai/flows/generate-math-response.ts`)**: Handles math questions. It uses a `calculatorTool` to perform arithmetic calculations.
*   **Physics Agent (`src/ai/flows/generate-physics-explanation.ts`)**: Handles physics questions. It uses a `physicsConstantsTool` to look up values of physical constants.
*   **Orchestration**: The Tutor Agent delegates the query to the appropriate specialist agent and returns the response to the user.

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
