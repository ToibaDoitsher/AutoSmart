export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // כאן את מכניסה את המידע על עצמך - המודל יתייחס לזה כחלק מההנחיות שלו
    const myContext = "קוראים לי טובה, אני מפתחת את אפליקציית AutoSmart. האפליקציה נועדה לניהול חכם של משימות.";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // מודל חזק מאוד וחינמי
                messages: [
                    { role: "system", content: `You are a helpful assistant. Information about me: ${myContext}. Answer in Hebrew.` },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || "שגיאה בשרת ה-AI" });
        }

        return res.status(200).json({ reply: data.choices[0].message.content.trim() });

    } catch (e) {
        return res.status(500).json({ error: "קריסה: " + e.message });
    }
}
