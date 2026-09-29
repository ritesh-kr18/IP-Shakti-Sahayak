"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Shield, AlertTriangle, BookOpen } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    { 
      role: "ai", 
      content: "Hello! I am **IP-SAKTI**, your Ayurveda IP & Regulatory Decision Intelligence Assistant.\n\nI can help you:\n- **Analyze Patentability** (Check Section 3(p) and 3(e) rules)\n- **Calculate Biopiracy Risk** (Using my Deterministic Rules Engine)\n- **Search AYUSH Guidelines** (Directly from the offline database)\n\n*How can I help you today?*" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "❌ Error connecting to the server. Is the FastAPI backend running on port 8000?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-4 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-8 mt-4">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-wide">IP-SAKTI</h1>
        </div>
        
        <div className="text-xs text-slate-400 mb-4 uppercase tracking-widest font-bold">Live Capabilities</div>
        <ul className="space-y-4 text-sm text-slate-300">
          <li className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-400"/> 
            <span>Legal Database (RAG)</span>
          </li>
          <li className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400"/> 
            <span>Risk Scorer Engine</span>
          </li>
          <li className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400"/> 
            <span>Agentic Orchestration</span>
          </li>
        </ul>
        
        <div className="mt-auto p-4 bg-slate-800 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400">SIH 2026 Prototype</p>
          <p className="text-xs font-bold text-white mt-1">Ministry of AYUSH</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {/* Header */}
        <header className="p-5 border-b bg-white shadow-sm flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-gray-800">Decision Intelligence Dashboard</h2>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            Secure Mode Active
          </span>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-6 shadow-sm ${msg.role === "user" ? "bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}>
                {msg.role === "user" ? (
                  <div className="text-[15px] leading-relaxed font-medium">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-table:border-collapse prose-th:bg-gray-100 prose-td:border prose-th:border prose-th:p-2 prose-td:p-2 prose-table:w-full prose-table:my-4 prose-li:marker:text-emerald-500">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-5 shadow-sm flex items-center gap-3 text-gray-500">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
                <span className="text-sm font-medium animate-pulse text-emerald-700">Agent is orchestrating tools...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about patenting an Ayurvedic formulation, biopiracy risks, or AYUSH rules..."
              className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all text-gray-800 bg-gray-50 text-[15px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-3 font-medium">IP-SAKTI may make mistakes. Please verify important legal information against official AYUSH guidelines.</p>
        </div>
      </div>
    </div>
  );
}
