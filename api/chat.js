export default async function handler(req, res) {
  try {
    // Allow only POST
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Method not allowed" });
    }

    // SAFELY read message
    let userMessage = "";
    if (req.body && typeof req.body === "object") {
      userMessage = req.body.message || "";
    }

    if (!userMessage) {
      return res.status(200).json({
        reply: "Please type your message again."
      });
    }

    const openaiRes = await fetch(
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
                "You are a soy wax candle assistant. Explain benefits of soy wax and help users place candle orders."
            },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await openaiRes.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No AI reply"
    });

  } catch (err) {
    console.error("BACKEND ERROR:", err);
    return res.status(200).json({
      reply: "Backend error occurred"
    });
  }
}
