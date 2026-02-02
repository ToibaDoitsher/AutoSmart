export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN; 

    // בדיקה אם המפתח קיים בכלל ב-Vercel
    if (!HF_TOKEN) {
        return res.status(500).json({ error: "Missing HF_TOKEN in Vercel environment variables" });
    }

    try {
        // כתובת ה-API הרשמית והיצירה ביותר
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

        // אם Hugging Face מחזירים שגיאה (כמו 401 או 404)
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "Hugging Face Error" });
        }

        let result = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        res.status(200).json({ reply: result || "לא התקבלה תשובה מהמודל" });

    } catch (e) {
        res.status(500).json({ error: "Server Crash: " + e.message });
    }
}
