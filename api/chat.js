export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const userMessage = req.body.message || "";

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a soy wax candle assistant. Explain benefits and help place orders.",
            },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No reply",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Backend crashed",
    });
  }
}
