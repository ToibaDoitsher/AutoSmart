export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // שימוש בכתובת ה-API הישירה (Legacy Inference) - הכי אמינה כרגע
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nענה בעברית: ${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: { max_new_tokens: 250 },
                options: { wait_for_model: true }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "Hugging Face Error" });
        }

        // חילוץ טקסט בפורמט הישיר
        const reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        // ניקוי התשובה כדי להציג רק את מה שהבוט ענה
        const cleanReply = reply.split("<|start_header_id|>assistant<|end_header_id|>").pop().trim();

        return res.status(200).json({ reply: cleanReply });

    } catch (e) {
        return res.status(500).json({ error: 'Server Error: ' + e.message });
    }
}
