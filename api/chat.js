export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { text } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN; 

    try {
        // שימוש במודל Llama-3.2-3B - מהיר מאוד ותומך בעברית מצוין
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nענה בעברית: ${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: { 
                    max_new_tokens: 250,
                    return_full_text: false,
                    temperature: 0.7
                },
                options: {
                    wait_for_model: true // גורם ל-API להמתין עד שהמודל יטען במקום להחזיר שגיאה
                }
            })
        });

        const data = await response.json();

        // בדיקה אם חזרה תשובה תקינה
        let result = "";
        if (Array.isArray(data) && data[0].generated_text) {
            result = data[0].generated_text.trim();
        } else if (data.error) {
            result = "שגיאת מערכת: " + data.error;
        } else {
            result = "המערכת לא החזירה תשובה, נסי שוב בעוד רגע.";
        }

        res.status(200).json({ reply: result });

    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ error: "חלה שגיאה בשרת: " + e.message });
    }
}
