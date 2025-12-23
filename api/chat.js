export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Only POST requests are allowed"
    });
  }

  try {
    const userMessage = req.body?.message;
    if (!userMessage) {
      return res.status(200).json({
        reply: "Please type your message again."
      });
    }

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
You are a Soy Wax Candle Assistant.

Rules:
1. If user asks "why soy wax", explain benefits clearly.
2. If user says they want to place an order:
   - Ask for fragrance (Rose, Lavender, Ocean)
   - Ask for size (50 ml ₹299, 100 ml ₹499)
3. If user gives fragrance but not size, ask for size.
4. If user gives size but not fragrance, ask for fragrance.
5. Keep replies short, friendly, and clear.
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Please tell me your preferred fragrance and size.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({
      reply: "AI service error. Please try again later."
    });
  }
}
