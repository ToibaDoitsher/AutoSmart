export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) return res.status(500).json({ error: 'Missing Token' });

    try {
        // כתובת ישירה למודל ללא v1 או router - זו הכתובת הכי אמינה כרגע
        const url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<s>[INST] ענה בעברית: ${text} [/INST]`,
                parameters: { max_new_tokens: 500 },
                options: { wait_for_model: true }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "Model Error" });
        }

        // במודל Mistral בכתובת הזו, התשובה חוזרת בפורמט הזה:
        const reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        // ניקוי הפלט מההוראות של המערכת
        const cleanReply = reply.split('[/INST]').pop().trim();

        return res.status(200).json({ reply: cleanReply });

    } catch (e) {
        return res.status(500).json({ error: 'Server Crash: ' + e.message });
    }
}
