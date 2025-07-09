export async function onRequestPost(context) {
  const { request, env } = context;

  // --- Fix 1: Input Validation ---
  let prompt;
  try {
    // Await the json() promise to resolve before destructuring
    const requestBody = await request.json();
    prompt = requestBody.prompt;

    if (!prompt) {
      // If prompt is missing, undefined, or an empty string
      return new Response(JSON.stringify({ error: "Missing 'prompt' in request body." }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    // If the request body is not valid JSON
    return new Response(JSON.stringify({ error: "Invalid JSON in request body." }), {
      status: 400, // Bad Request
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const apiKey = env.API_KEY;

  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            // The prompt is now validated to exist
            { text: `Write a short, creative poem about: ${prompt}` }
          ]
        }
      ],
      // Add safety settings and generation config for more control
      "safetySettings": [
        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
      ],
      "generationConfig": {
        "temperature": 0.9,
        "topK": 1,
        "topP": 1,
        "maxOutputTokens": 2048
      }
    }),
  });

  // --- Fix 2: API Error Handling ---
  if (!geminiResponse.ok) {
    const errorData = await geminiResponse.json();
    console.error("Gemini API Error:", errorData); // Log the full error for debugging
    return new Response(JSON.stringify({
      error: "Failed to get response from Gemini API.",
      details: errorData.error?.message || "Unknown API error."
    }), {
      status: geminiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await geminiResponse.json();

  console.log("Gemini API response:", JSON.stringify(data, null, 2));
  console.log("Gemini API status:", geminiResponse.status);

  // --- Fix 3: Safety Block Handling ---
  if (!data.candidates || data.candidates.length === 0) {
    const finishReason = data.promptFeedback?.blockReason;
    const errorMessage = finishReason ? `Content blocked due to ${finishReason}.` : "No poem generated. The model returned no candidates.";
    
    return new Response(JSON.stringify({ poem: errorMessage }), {
        headers: { "Content-Type": "application/json" },
    });
  }
  
  const poem = data.candidates[0]?.content?.parts[0]?.text || "No poem generated.";

  return new Response(JSON.stringify({ poem }), {
    headers: { "Content-Type": "application/json" },
  });
}