const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Default fallback response if API strictly fails
const DEFAULT_RESPONSE = {
    act: "General Legal Advisory",
    section: "Relevant provisions",
    punishment: "Varies depending on the specific nature of the crime.",
    action: "Please report the incident to the local authorities or seek legal counsel.",
    contact: "National Emergency Number \u2013 112, Police \u2013 100"
};

router.post('/chat', async (req, res) => {
    try {       
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        let legalAdvice = null;

        // Try using the free unauthenticated LLM Proxy (text.pollinations.ai)
        try {
            const systemPrompt = `You are a strict AI Legal Assistant specializing in Indian Law.
A user has submitted the following legal situation/query: "${prompt}"

Identify the correct Indian laws and respond with a JSON object containing EXACTLY these 5 keys:
1. "act": The correct Act (e.g., IPC, POCSO)
2. "section": The specific section numbers.
3. "punishment": A brief sentence on the punishment.
4. "action": What You Should Do (one actionable sentence).
5. "contact": Emergency Contact (e.g., Police - 100, Cyber Crime - 1930).

Respond ONLY with valid, raw JSON structured like this:
{"act":"...","section":"...","punishment":"...","action":"...","contact":"..."}
Do NOT wrap the JSON in markdown blocks like \`\`\`json.`;

            const response = await fetch("https://text.pollinations.ai/openai/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai", // maps to a generic fast LLM on pollinations
                    messages: [
                        { role: "system", content: systemPrompt }
                    ],
                    jsonMode: true // Hints to the API to prefer JSON if supported
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.choices && result.choices.length > 0) {
                    let content = result.choices[0].message.content;
                    // Clean markdown code blocks just in case
                    content = content.replace(/```json/gi, '').replace(/```/gi, '').trim();

                    const parsed = JSON.parse(content);

                    // Verify it has the expected keys
                    if (parsed.act && parsed.action) {
                        legalAdvice = parsed;
                    }
                }
            }
        } catch (apiError) {
            console.error("Pollinations API Error:", apiError.message);
        }

        // If the API failed or returned badly formatted JSON, use the default
        if (!legalAdvice) {
            legalAdvice = DEFAULT_RESPONSE;
        }

        // Format exactly as the user specified
        const formattedResponse = `Act: ${legalAdvice.act}
Section: ${legalAdvice.section}
Punishment: ${legalAdvice.punishment}
What You Should Do: ${legalAdvice.action || legalAdvice["What You Should Do"]}
Emergency Contact: ${legalAdvice.contact || legalAdvice["Emergency Contact"]}`;

        return res.status(200).json({
            success: true,
            answer: formattedResponse,
            structuredData: legalAdvice
        });

    } catch (error) {
        console.error("AI Chatbot Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

module.exports = router;
