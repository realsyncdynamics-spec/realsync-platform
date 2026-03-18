"use client";

import { useState } from "react";
import { Brain, Send, Copy, Star, RotateCcw } from "lucide-react";

const MODELS = [
  { id: "claude", name: "Claude 3.5", provider: "Anthropic", color: "#D97706" },
  { id: "gemini", name: "Gemini Pro", provider: "Google", color: "#3B82F6" },
  { id: "perplexity", name: "Perplexity", provider: "Perplexity", color: "#10B981" },
  { id: "deepseek", name: "DeepSeek", provider: "DeepSeek", color: "#8B5CF6" },
];

export default function OptimusPage() {
  const [input, setInput] = useState("");
  const [activeModel, setActiveModel] = useState("claude");
  const [messages, setMessages] = useState<{role:string;content:string;model:string}[]>([
    { role: "assistant", content: "Hallo! Ich bin RealSync Optimus. Waehle ein KI-Modell und stelle deine Frage.", model: "claude" },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input, model: activeModel }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `[${MODELS.find(m=>m.id===activeModel)?.name}] Demo-Antwort: ${input}. In der Produktionsversion rotiert Optimus automatisch zwischen 9 KI-Modellen fuer optimale Ergebnisse.`,
        model: activeModel
      }]);
    }, 800);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a]">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Brain size={16} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-white text-sm font-semibold">RealSync Optimus</h1>
            <p className="text-zinc-600 text-xs font-mono">Multi-KI Chat · Model Router · by RealSync Apps</p>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-zinc-400 transition"><RotateCcw size={14} /></button>
      </div>

      <div className="px-6 py-2 border-b border-zinc-800 flex gap-2">
        {MODELS.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModel(m.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeModel === m.id
                ? "bg-zinc-800 text-white"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{backgroundColor: m.color}} />
            {m.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-xl text-sm ${
              msg.role === 'user'
                ? 'bg-zinc-800 text-zinc-200'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
            }`}>
              {msg.content}
              {msg.role === 'assistant' && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800">
                  <button className="text-zinc-600 hover:text-zinc-400"><Copy size={11} /></button>
                  <button className="text-zinc-600 hover:text-yellow-400"><Star size={11} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Nachricht eingeben..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
          />
          <button onClick={send} className="text-zinc-500 hover:text-yellow-400 transition"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}
