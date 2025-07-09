export async function onRequestPost(context) {
    const { request, env } = context;
    const { prompt } = await request.json();
  
    const apiKey = env.API_KEY;
  
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Write a short, creative poem about: ${prompt}` }
            ]
          }
        ]
      }),
    });
  
    const data = await response.json();
  
    const poem = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No poem generated.";
  
    return new Response(JSON.stringify({ poem }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  