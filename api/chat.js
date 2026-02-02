export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { text } = req.body;
        
        // כאן הקסם: אנחנו לא כותבים את המפתח, אלא מושכים אותו מההגדרות של Vercel
        const HF_TOKEN = process.env.HF_TOKEN;

        if (!HF_TOKEN) {
            return res.status(500).json({ error: "Missing API Token in Vercel settings" });
        }

        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `[INST] אתה עוזר חכם בשם טויבי-בוט. ענה בעברית בלבד ובקצרה: ${text} [/INST]`,
                parameters: { max_new_tokens: 150 }
            })
        });

        const data = await response.json();
        
        let result = "";
        if (Array.isArray(data) && data[0].generated_text) {
            result = data[0].generated_text.split("[/INST]").pop().trim();
        } else {
            result = "המודל מתעורר... נסו שוב בעוד רגע.";
        }

        return res.status(200).json({ reply: result });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
