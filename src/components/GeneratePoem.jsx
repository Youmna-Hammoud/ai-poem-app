import { useState, forwardRef, useImperativeHandle } from "react";

const GeneratePoem = forwardRef(function GeneratePoem({ prompt }, ref) {
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePoem = async () => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const res = await fetch("/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate poem");

      const data = await res.json();
      setResponse(data.poem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    generatePoem,
  }));

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>{response}</p>}
    </div>
  );
});

export default GeneratePoem;