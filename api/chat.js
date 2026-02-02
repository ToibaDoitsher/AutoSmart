export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // כתובת ישירה ומדויקת למודל (ללא הראוטר הבעייתי)
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: text,
                parameters: { max_new_tokens: 200 },
                options: { wait_for_model: true }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // זה ידפיס לנו בדיוק מה Hugging Face אומרים
            return res.status(response.status).json({ error: data.error || "Hugging Face Error" });
        }

        const reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        res.status(200).json({ reply: reply || "לא התקבלה תשובה" });

    } catch (e) {
        res.status(500).json({ error: "Server Crash: " + e.message });
    }
}
