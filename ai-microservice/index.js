require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to log request IDs
app.use((req, res, next) => {
    req.requestId = Math.random().toString(36).substring(7);
    console.log(`[${new Date().toISOString()}] reqId: ${req.requestId} | ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ai-microservice' });
});

app.post('/generate/copy', async (req, res) => {
    const { prompt, tone, keywords } = req.body;
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for speed/cost effectiveness
            messages: [
                { role: "system", content: "You are an expert advertising copywriter." },
                { role: "user", content: `Write a compelling campaign copy. Context: ${prompt}. Tone: ${tone}. Keywords: ${(keywords || []).join()}` }
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error(`[${req.requestId}] Error in SSE:`, error);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate copy' })}\n\n`);
        res.end();
    }
});

app.post('/generate/social', async (req, res) => {
    const { prompt, tone } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Create a short, punchy social media post. Use emojis." },
                { role: "user", content: `Topic: ${prompt}. Tone: ${tone}.` }
            ],
        });
        res.json({ text: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/generate/hashtags', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Generate 10 relevant hashtags based on the prompt. Only output the hashtags separated by spaces." },
                { role: "user", content: `Topic: ${prompt}` }
            ],
        });
        res.json({ hashtags: response.choices[0].message.content.split(' ') });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`AI Microservice running on port ${PORT}`);
});
