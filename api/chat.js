export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN; 

    try {
        // הכתובת החדשה והמעודכנת של Hugging Face
        const url = "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.2-3B-Instruct";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nענה בעברית: ${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: { 
                    max_new_tokens: 300,
                    temperature: 0.7,
                    top_p: 0.9
                },
                options: {
                    wait_for_model: true
                }
            })
        });

        const data = await response.json();

        // בדיקה אם ה-API החזיר תשובה בפורמט החדש
        let result = "";
        
        if (Array.isArray(data) && data[0].generated_text) {
            result = data[0].generated_text.trim();
        } else if (data.choices && data.choices[0].message) {
            // תמיכה בפורמט ה-Chat החדש (דומה ל-OpenAI) שחלק מהראוטרים מחזירים
            result = data.choices[0].message.content;
        } else if (data.error) {
            result = "שגיאת Hugging Face: " + data.error;
        } else {
            result = "המערכת לא זיהתה את פורמט התשובה. נסי שוב.";
        }

        res.status(200).json({ reply: result });

    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ error: "שגיאה בחיבור לשרת: " + e.message });
    }
}
