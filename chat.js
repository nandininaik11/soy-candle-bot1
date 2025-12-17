export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a Soy Wax Candle Assistant.
Educate users about benefits of soy wax:
- Eco-friendly
- Non-toxic
- Long lasting
Help them place candle orders.
Flavours: Rose, Lavender, Ocean
Sizes: 50ml ₹299, 100ml ₹499
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ reply: "AI service error" });
  }
}
