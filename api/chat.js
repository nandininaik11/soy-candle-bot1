export default function handler(req, res) {
  return res.status(200).json({
    reply: "✅ Backend and frontend are connected successfully"
  });
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Only POST requests are allowed"
    });
  }

  try {
    // Safely read user message
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(200).json({
        reply: "Please type your message again."
      });
    }

    // Call OpenAI API
    const openaiResponse = await fetch(
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
              content: `
You are a friendly Soy Wax Candle Assistant.
Your job is to:
- Explain why soy wax candles are better (eco-friendly, non-toxic, longer burn).
- Help users place candle orders.

Available flavours: Rose, Lavender, Ocean  
Available sizes: 50 ml (₹299), 100 ml (₹499)
`
            },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    // Return AI reply
    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || 
             "Sorry, I could not generate a response."
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      reply: "Server error. Please try again later."
    });
  }
}

