export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // שימוש במודל Qwen - הכי סובלני לעברית ולחשבונות חינמיים
        const response = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-7B-Instruct",
                messages: [{ role: "user", content: text }],
                max_tokens: 500
            })
        });

        // בדיקה אם התגובה היא בכלל JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            return res.status(500).json({ error: "שרת ה-AI שלח טקסט במקום JSON. פרטים: " + errorText.substring(0, 50) });
        }

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || data.error || "שגיאה ב-Hugging Face" });
        }

        return res.status(200).json({ reply: data.choices[0].message.content.trim() });

    } catch (e) {
        return res.status(500).json({ error: "קריסת מערכת: " + e.message });
    }
}
