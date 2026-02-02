export default async function handler(req, res) {
    // מאפשר רק בקשות POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
        return res.status(500).json({ error: 'חסר HF_TOKEN בהגדרות Vercel' });
    }

    try {
        // מודל Llama 3.2 - מהיר, חכם ותומך בעברית
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nענה בעברית: ${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: { 
                    max_new_tokens: 500,
                    temperature: 0.7
                },
                options: {
                    wait_for_model: true // קריטי: גורם לשרת לחכות שהמודל יטען
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "שגיאה מהמודל" });
        }

        // חילוץ התשובה בצורה בטוחה
        const reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        return res.status(200).json({ reply: reply.trim() });

    } catch (e) {
        return res.status(500).json({ error: 'Server Error: ' + e.message });
    }
}
