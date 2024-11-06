// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from 'dotenv';

// Load environment variables
configDotenv();

// Initialize Google Generative AI client with the API key
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Express app
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json()); // Middleware to parse JSON request body

// POST endpoint to evaluate goal
app.post("/evaluate-goal", async (req, res) => {
    console.log("Request body:", req.body); // Log the incoming request body
    const { target, evaluation } = req.body;

    if (!target || !evaluation) {
        return res.status(400).json({ error: "Target and evaluation are required" });
    }

    try {
        // Get the Gemini model
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });

        // Create a prompt for the AI
        const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", determine if the goal has been achieved and explain why.`;

        // Generate response using the AI model
        const result = await model.generateContent(prompt);

        // Extract and send the AI's response
        const aiEvaluation = result.response.text();
        res.json({ aiEvaluation });
    } catch (error) {
        console.error("Error with the Google Generative AI API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST endpoint to get help or clarification from the AI
app.post("/help", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        // Get the Gemini model
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });

        // Generate response from AI
        const result = await model.generateContent(prompt);

        // Extract and send the AI's response
        const aiResponse = result.response.text();
        res.json({ aiResponse });
    } catch (error) {
        console.error("Error with the Google Generative AI API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});