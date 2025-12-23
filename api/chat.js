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
              content:
                "You are a friendly soy wax candle assistant. Explain benefits of soy wax candles and help users place orders."
            },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content ||
             "Sorry, I could not generate a response."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Server error. Please try again later."
    });
  }
}
