export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const url = "https://router.huggingface.co/hf-inference/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // שימוש במודל Microsoft - הוא הכי יציב בראוטר החינמי
                model: "microsoft/Phi-3-mini-4k-instruct",
                messages: [
                    { role: "user", content: text }
                ],
                max_tokens: 500
            })
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `שגיאה מהשרת: ${responseText}` 
            });
        }

        const data = JSON.parse(responseText);
        return res.status(200).json({ reply: data.choices[0].message.content.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'קריסה: ' + e.message });
    }
}
