export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const userMessage = req.body.message;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "OpenAI API key missing"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
              content:
                "You are a soy wax candle assistant. Explain soy wax benefits and help place orders. Flavours: Rose, Lavender, Ocean. Sizes: 50ml ₹299, 100ml ₹499."
            },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({ reply: "AI error" });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Server error"
    });
  }
}
