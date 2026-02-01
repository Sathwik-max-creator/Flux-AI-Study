const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// SECURITY: Use process.env so your key isn't hardcoded
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY 
});

app.post('/ask', async (req, res) => {
    try {
        const { prompt, subject } = req.body;
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });

        const aiText = chatCompletion.choices[0]?.message?.content || "";
        res.json({ text: aiText });
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ text: "The AI is offline. Check API settings." });
    }
});

// PORT: Use the cloud provider's port OR 3000 for local testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Flux Backend live on port ${PORT}`);
});