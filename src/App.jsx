import './App.css'
import { useRef, useState } from 'react';
import GeneratePoem from './components/GeneratePoem';

function App() {
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const poemRef = useRef();

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    const currentPrompt = prompt;
    setSubmittedPrompt(currentPrompt);
    if (poemRef.current) {
      poemRef.current.generatePoem();
    }
    setPrompt("");
  };

  return (
    <>
      <header className="header">
        <h1 className="title">AI Poem Generator</h1>
        <p className="subtitle">Create beautiful poems with AI</p>
      </header>
      <p className="description">
        Enter a topic and let AI generate a unique poem for you. Perfect for inspiration or just for fun!
      </p>
      <input
        type="text"
        placeholder="Enter a topic for your poem"
        className="input-section"
        value={prompt}
        onChange={handleInputChange}
      />
      <button className="generate-button fade-in" onClick={handleGenerate}>Generate Poem</button>
      <div className="poem-output">
        <GeneratePoem ref={poemRef} prompt={submittedPrompt} />
      </div>
      <footer className="footer">
        <p>Made by <a href='https://www.instagram.com/youmnalearns?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='>@youmnalearns</a></p>
        <p>© 2025</p>
      </footer>
    </>
  )
}

export default App
