import { useState, forwardRef, useImperativeHandle } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeneratePoem = forwardRef(function GeneratePoem({ prompt }, ref) {
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePoem = async () => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    generatePoem
  }));

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>{response}</p>}
    </div>
  );
});

export default GeneratePoem;