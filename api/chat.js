export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // זו הכתובת היחידה שנתמכת ב-2026
        const url = "https://router.huggingface.co/hf-inference/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/Mistral-7B-Instruct-v0.3",
                messages: [
                    { role: "user", content: text }
                ],
                max_tokens: 500
            })
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `Hugging Face Error: ${responseText}` });
        }

        const data = JSON.parse(responseText);
        return res.status(200).json({ reply: data.choices[0].message.content.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'קריסת שרת: ' + e.message });
    }
}
