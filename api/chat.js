export default async function handler(req, res) {
    // בדיקה קריטית: האם הבקשה היא POST?
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'נא להשתמש בשיטת POST' });
    }

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
        return res.status(500).json({ error: 'חסר HF_TOKEN ב-Vercel Settings' });
    }

    try {
        // הכתובת החדשה והיחידה שנתמכת ב-2026
        const url = "https://router.huggingface.co/hf-inference/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.2-3B-Instruct",
                messages: [{ role: "user", content: "ענה בעברית: " + text }],
                max_tokens: 500
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "שגיאה מה-AI" });
        }

        return res.status(200).json({ reply: data.choices[0].message.content.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'קריסה: ' + e.message });
    }
}
