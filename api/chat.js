export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN; // משיכה מהגדרות Vercel

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `[INST] ענה בעברית קצרה מאוד: ${text} [/INST]`,
                parameters: { max_new_tokens: 150 }
            })
        });

        const data = await response.json();
        let result = (Array.isArray(data) && data[0].generated_text) 
            ? data[0].generated_text.split("[/INST]").pop().trim() 
            : "השרת בטעינה, נסו שוב.";

        res.status(200).json({ reply: result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
