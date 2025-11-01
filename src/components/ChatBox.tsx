import React, { useState } from "react";
import { getGeminiResponse } from "../services/geminiService";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // play song command
    if (input.toLowerCase().includes("play song")) {
      const query = input.replace(/play song/i, "").trim() || "music";
      const url = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        query
      )}&autoplay=1`;
      setResponse(
        `<iframe width='300' height='200' src='${url}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>`
      );
      setLoading(false);
      return;
    }

    // Gemini AI call
    const reply = await getGeminiResponse(input);
    setResponse(reply);
    setLoading(false);
    setInput("");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Ask ROZ</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button
          onClick={handleAsk}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ask
        </button>
      </div>

      <div className="mt-4 min-h-[120px] p-3 border rounded-lg bg-gray-50 overflow-y-auto text-left">
        {loading ? (
          <p className="text-gray-400">Thinking...</p>
        ) : response ? (
          <div dangerouslySetInnerHTML={{ __html: response }} />
        ) : (
          <p className="text-gray-400">Type something to begin...</p>
        )}
      </div>
    </div>
  );
}
