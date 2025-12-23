export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "POST only" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
You are a friendly Soy Wax Candle Assistant.
Explain benefits of soy wax clearly.
If user asks about ordering, politely guide them to choose fragrance and size.
Keep replies short and simple.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Sorry, I couldn’t reply.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI error" });
  }
}
