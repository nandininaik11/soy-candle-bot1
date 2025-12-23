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
            content:
              "You are a friendly soy wax candle assistant. Explain benefits of soy wax candles and help users place orders."
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
      "No response from AI";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({
      reply: "AI service error. Please try again later."
    });
  }
}
