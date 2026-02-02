export default async function handler(req, res) {
    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // המודל הזה הוא הכי קבוע והכי יציב ב-Hugging Face
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
            method: "POST",
            headers: { "Authorization": `Bearer ${HF_TOKEN}` },
            body: JSON.stringify({ inputs: text })
        });

        const data = await response.json();
        
        if (!response.ok) return res.status(500).json({ error: "טעות בטוקן או בשרת" });

        const reply = data.generated_text || data[0]?.generated_text || "ה-AI ענה אבל התשובה ריקה";
        return res.status(200).json({ reply });

    } catch (e) {
        return res.status(500).json({ error: "תקלה: " + e.message });
    }
}
