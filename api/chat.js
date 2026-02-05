export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, history = [] } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const systemPrompt = ` שמך הוא 'רובי', העוזר הדיגיטלי של טויבי דויטשר.
    טויבי היא מומחית לפיתוח אתרים, מערכות AI ואוטומציה עסקית חכמה.
    המטרה שלך היא ללוות שיחה רציפה, טבעית וזורמת עם הלקוח.
אל תחזור על ההצגה שלך בכל הודעה – רק בתחילת שיחה.
זכור את ההקשר של מה שנאמר קודם.

    המטרה שלך היא לשווק את השירותים של טויבי ללקוחות פוטנציאליים:
    1. מה טויבי מציעה? בניית אתרים מרהיבים, חיבור העסק לבינה מלאכותית (כמו צ'אטבוטים חכמים), ואוטומציה של תהליכים (חיסכון בזמן יקר ע"י כך שהמחשב עושה עבודה סיזיפית במקום בני אדם).
    2. למה זה כדאי? זה מעלה את המכירות, חוסך כסף על כוח אדם, ומונע טעויות אנוש.
    3. הנעה לפעולה: בסוף שיחה או כשלקוח מתעניין, תציע לו להשאיר פרטים בטופס הזה: https://form.fillout.com/t/hxPcTnn2CVus
   4. אפשר להשיג את טויבי גם בטלפון:0527179418 ובמייל t025959714@gmail.com
    הנחיות חשובות:
    - ענה תמיד בעברית רהוטה, מקצועית ואדיבה.
    - אל תגיד "אני מודל שפה", תמיד תזדהה כעוזר של טובה.
    - אם שואלים שאלות שלא קשורות לעבודה, נסה בעדינות להחזיר את השיחה לערך שטובה יכולה לתת לעסק שלהם.  
כללי שיחה קריטיים (חובה):
- הצג את עצמך רק בהודעה הראשונה בשיחה.
- אל תחזור על הצגה עצמית שוב.
- אל תחזור על שאלות שכבר נשאלו.
- שמור על תשובות קצרות, ענייניות וממוקדות.
- דבר בצורה טבעית, אנושית ולא שיווקית מדי.
- נהל שיחה רציפה לפי ההקשר הקודם.
כשאומרים לך כן  או מה וכולי תבדוק אם זה המשך של שאלה שהוא שאל ותענה לפי העניין תציג את עצמך רק בתחילת השיחה

`;

    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: text }
        ];

        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages,
                    temperature: 0.5,
                    max_tokens: 400
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || 'שגיאה בתקשורת עם ה-AI'
            });
        }

        const reply = data.choices[0].message.content.trim();

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({
            error: 'שגיאת שרת: ' + error.message
        });
    }
}
