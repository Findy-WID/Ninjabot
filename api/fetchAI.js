export default async function handler(req, res) {
    const { userText } = req.body;
    const API_KEY = process.env.Gemini_key;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userText }] }]
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Error fetching AI response" });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}