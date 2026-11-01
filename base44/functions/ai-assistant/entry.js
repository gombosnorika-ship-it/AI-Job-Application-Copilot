
export default async function (req) {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Only POST requests are supported." },
      { status: 405 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    // The API key must be stored as a backend secret.
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key is not configured." },
        { status: 503 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt.slice(0, 8000),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return Response.json(
        { error: "The AI service request failed." },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    if (!reply) {
      return Response.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("AI assistant backend error:", error);

    return Response.json(
      { error: "The AI request failed. Please try again." },
      { status: 500 }
    );
  }
}
