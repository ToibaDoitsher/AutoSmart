export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // הכתובת היחידה שורסל והאגינג פייס יסכימו עליה עכשיו
        const url = "https://router.huggingface.co/hf-inference/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.2-3B-Instruct",
                messages: [
                    { role: "system", content: "ענה בעברית בלבד." },
                    { role: "user", content: text }
                ],
                max_tokens: 500,
                stream: false
            })
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `Hugging Face Error: ${responseText}` });
        }

        const data = JSON.parse(responseText);
        const reply = data.choices[0].message.content;
        
        return res.status(200).json({ reply: reply.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'Server Crash: ' + e.message });
    }
}
