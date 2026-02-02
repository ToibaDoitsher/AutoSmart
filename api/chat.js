export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
        return res.status(500).json({ error: 'חסר HF_TOKEN ב-Vercel' });
    }

    try {
        // הכתובת המדויקת לראוטר החדש
        const url = "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "user", content: "ענה בעברית: " + text }
                ],
                max_tokens: 500,
                stream: false
            })
        });

        // בדיקה אם התקבלה תשובה תקינה לפני שמנסים להפוך ל-JSON
        const responseText = await response.text();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `שגיאת שרת: ${responseText}` });
        }

        const data = JSON.parse(responseText);
        const reply = data.choices[0].message.content;
        
        return res.status(200).json({ reply: reply.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'קריסה בקוד: ' + e.message });
    }
}
