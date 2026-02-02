export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });

        const data = await response.json();
        
        // אם המודל בטעינה, Hugging Face יחזיר הודעה מיוחדת
        if (data.estimated_time) {
            return res.status(200).json({ reply: "המודל מתעורר... נסה שוב בעוד כמה שניות!" });
        }

        if (!response.ok) return res.status(response.status).json({ error: data.error || "שגיאת תקשורת" });

        const result = data[0]?.generated_text || "לא התקבלה תשובה";
        return res.status(200).json({ reply: result.replace(text, "").trim() });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
