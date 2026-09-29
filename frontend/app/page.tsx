"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Shield, AlertTriangle, BookOpen, FileText, CheckCircle2, 
  Loader2, Send, Bot, Network, Calculator, Map, Fingerprint, 
  CalendarDays, GitCompare, Edit3, Globe, Languages, LogOut, Clock,
  FlaskConical, Download, Hash, Table, Layers, Users, XCircle, Mic, MicOff, ChevronDown
} from "lucide-react";

// ============================================================
// API CONFIGURATION
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${API_URL}`;

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthScreen({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [view, setView] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const roleOptions = [
    { value: "practitioner", label: "Practitioners" },
    { value: "researcher", label: "Researchers" },
    { value: "startup", label: "AYUSH Startups" },
    { value: "msme", label: "MSMEs" },
    { value: "cultivator", label: "Cultivators" },
    { value: "other", label: "Others" },
  ];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const endpoint = view === "register" ? "/api/auth/register" : "/api/auth/login";
    const body = view === "register" ? { name, email, role, password } : { email, password };
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.detail || "Authentication failed"); }
      else {
        if (view === "register") { alert("Registration successful! Please login."); setView("login"); }
        else { onLoginSuccess(data.user); }
      }
    } catch { setErrorMsg("Error connecting to server. Is FastAPI running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fdf6ec 0%, #f5ede0 30%, #faf3e8 60%, #f0e6d6 100%)" }}>

      {/* ---- CSS Animations ---- */}
      <style>{`
        @keyframes slowSpin { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-15px)} }
        .slow-spin { animation: slowSpin 120s linear infinite; }
        .float1 { animation: float1 8s ease-in-out infinite; }
        .float2 { animation: float2 10s ease-in-out infinite 2s; }
      `}</style>

      {/* ---- Indian Tricolor Accent (Top) ---- */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-30" style={{ background: "linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)" }} />

      {/* ---- Large Mandala (Center, slowly rotating) ---- */}
      <svg className="absolute left-1/2 top-1/2 pointer-events-none slow-spin" width="900" height="900" viewBox="0 0 200 200" fill="none" stroke="#c9a96e" strokeWidth="0.25" style={{ marginLeft: "-450px", marginTop: "-450px", opacity: 0.15 }}>
        <circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="80"/>
        <circle cx="100" cy="100" r="68"/><circle cx="100" cy="100" r="55"/><circle cx="100" cy="100" r="42"/>
        <circle cx="100" cy="100" r="28"/><circle cx="100" cy="100" r="14"/>
        <circle cx="100" cy="100" r="5" fill="#c9a96e" fillOpacity="0.15"/>
        {[0,15,30,45,60,75,90,105,120,135,150,165].map(a => <line key={`l${a}`} x1="100" y1="2" x2="100" y2="198" transform={`rotate(${a} 100 100)`}/>)}
        {[0,30,60,90,120,150].map(a => <path key={`p${a}`} d="M100 2 Q114 50 100 100 Q86 50 100 2Z" transform={`rotate(${a} 100 100)`}/>)}
        {[0,22.5,45,67.5,90,112.5,135,157.5].map(a => <ellipse key={`e${a}`} cx="100" cy="25" rx="8" ry="18" transform={`rotate(${a} 100 100)`}/>)}
      </svg>

      {/* ---- Lotus Watermark (Left side) ---- */}
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none float1" width="280" height="280" viewBox="0 0 100 100" fill="#d4956b" style={{ opacity: 0.12 }}>
        <path d="M50 12 C55 28, 68 34, 72 50 C65 54, 55 54, 50 68 C45 54, 35 54, 28 50 C32 34, 45 28, 50 12Z"/>
        <path d="M50 12 C55 28, 68 34, 72 50 C65 54, 55 54, 50 68 C45 54, 35 54, 28 50 C32 34, 45 28, 50 12Z" transform="rotate(72 50 50)"/>
        <path d="M50 12 C55 28, 68 34, 72 50 C65 54, 55 54, 50 68 C45 54, 35 54, 28 50 C32 34, 45 28, 50 12Z" transform="rotate(144 50 50)"/>
        <path d="M50 12 C55 28, 68 34, 72 50 C65 54, 55 54, 50 68 C45 54, 35 54, 28 50 C32 34, 45 28, 50 12Z" transform="rotate(216 50 50)"/>
        <path d="M50 12 C55 28, 68 34, 72 50 C65 54, 55 54, 50 68 C45 54, 35 54, 28 50 C32 34, 45 28, 50 12Z" transform="rotate(288 50 50)"/>
        <circle cx="50" cy="50" r="9" fill="#c9a96e" fillOpacity="0.4"/>
        <circle cx="50" cy="50" r="4" fill="#b8845a" fillOpacity="0.5"/>
      </svg>

      {/* ---- Ashoka Chakra (Right side) ---- */}
      <svg className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none float2" width="250" height="250" viewBox="0 0 100 100" fill="none" stroke="#2d6a4f" strokeWidth="0.5" style={{ opacity: 0.12 }}>
        <circle cx="50" cy="50" r="45"/><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="35"/>
        <circle cx="50" cy="50" r="7" fill="#2d6a4f" fillOpacity="0.2"/>
        {[0,15,30,45,60,75,90,105,120,135,150,165].map(a => <line key={a} x1="50" y1="8" x2="50" y2="92" transform={`rotate(${a} 50 50)`}/>)}
        {[0,15,30,45,60,75,90,105,120,135,150,165].map(a => <circle key={`d${a}`} cx="50" cy="8" r="2.5" fill="#2d6a4f" fillOpacity="0.2" transform={`rotate(${a} 50 50)`}/>)}
      </svg>

      {/* ---- Corner Paisley Pattern (Top-Right) ---- */}
      <svg className="absolute -top-10 -right-10 pointer-events-none" width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#c9a96e" strokeWidth="0.4" style={{ opacity: 0.1 }}>
        <path d="M80 20 C75 35, 60 45, 50 50 C40 45, 25 35, 20 20 C30 25, 45 15, 50 5 C55 15, 70 25, 80 20Z"/>
        <path d="M80 20 C75 35, 60 45, 50 50 C40 45, 25 35, 20 20 C30 25, 45 15, 50 5 C55 15, 70 25, 80 20Z" transform="rotate(90 50 50)"/>
        <circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="20"/>
      </svg>

      {/* ---- Corner Paisley Pattern (Bottom-Left) ---- */}
      <svg className="absolute -bottom-10 -left-10 pointer-events-none" width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#c9a96e" strokeWidth="0.4" style={{ opacity: 0.1 }}>
        <path d="M80 20 C75 35, 60 45, 50 50 C40 45, 25 35, 20 20 C30 25, 45 15, 50 5 C55 15, 70 25, 80 20Z"/>
        <path d="M80 20 C75 35, 60 45, 50 50 C40 45, 25 35, 20 20 C30 25, 45 15, 50 5 C55 15, 70 25, 80 20Z" transform="rotate(180 50 50)"/>
        <circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="20"/>
      </svg>

      {/* ---- Warm Glow Accents ---- */}
      <div className="absolute w-[500px] h-[500px] rounded-full -top-40 -left-40 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,153,51,0.08), transparent 60%)" }} />
      <div className="absolute w-[500px] h-[500px] rounded-full -bottom-40 -right-40 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(19,136,8,0.06), transparent 60%)" }} />

      {/* ---- Main Card ---- */}
      <div className="w-full max-w-md bg-white rounded-3xl relative z-10" style={{ boxShadow: "0 25px 60px -15px rgba(150,120,80,0.25), 0 0 0 1px rgba(200,170,120,0.15)" }}>
        <div className="flex border-b border-slate-100">
          <button onClick={() => {setView("login"); setErrorMsg("");}} className={`flex-1 py-4 font-bold text-center transition-colors rounded-tl-3xl ${view === "login" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>Login</button>
          <button onClick={() => {setView("register"); setErrorMsg("");}} className={`flex-1 py-4 font-bold text-center transition-colors rounded-tr-3xl ${view === "register" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>Register</button>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4"><div className="bg-emerald-100 p-4 rounded-full shadow-sm"><Shield className="w-10 h-10 text-emerald-600" /></div></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">IP-Shakti Sahayak</h1>
            <p className="text-emerald-600 font-bold text-[11px] mt-1 uppercase tracking-widest">Intelligent Decision Engine</p>
          </div>
          <h2 className="text-lg font-bold text-center text-slate-500 border-b border-slate-100 pb-4">{view === "register" ? "Create your account" : "Log in to your dashboard"}</h2>
          {errorMsg && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold border border-rose-200">{errorMsg}</div>}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {view === "register" && (<>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-colors" placeholder="Enter your full name" /></div>
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                <div onClick={() => setIsRoleOpen(!isRoleOpen)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-pointer flex justify-between items-center transition-colors hover:border-slate-300">
                  <span className={role ? "text-slate-900" : "text-slate-400"}>{role ? roleOptions.find(r => r.value === role)?.label : "Select your role..."}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`} />
                </div>
                {isRoleOpen && (
                  <div className="absolute top-0 left-full ml-4 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-left-2">
                    {roleOptions.map(r => (
                      <div key={r.value} onClick={() => { setRole(r.value); setIsRoleOpen(false); }} className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 font-medium transition-colors">
                        {r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>)}
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-colors" placeholder="Enter your email" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-colors" placeholder="••••••••" /></div>
            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex justify-center transition-colors">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (view === "register" ? "Complete Registration" : "Login to Dashboard")}</button>
          </form>
        </div>
      </div>

      {/* ---- Bottom Tricolor Line ---- */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 z-30" style={{ background: "linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)" }} />

      {/* ---- Ministry of AYUSH Badge ---- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-center">
        <p className="text-[9px] font-bold text-amber-800/40 uppercase tracking-[0.3em]">Ministry of AYUSH • Government of India</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("unified");
  const [language, setLanguage] = useState("English");
  const [jurisdiction, setJurisdiction] = useState("India");
  const [persona, setPersona] = useState("innovator");

  // Unified Agent
  const [query, setQuery] = useState("");
  const [chatContext, setChatContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResponse, setAgentResponse] = useState<any>(null);

  // Voice Assistant
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const langCodeMap: Record<string, string> = {
    English: "en-IN", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN",
    Marathi: "mr-IN", Bengali: "bn-IN", Gujarati: "gu-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Sanskrit: "sa-IN",
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceSupported(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langCodeMap[language] || "en-IN";
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) { transcript += event.results[i][0].transcript; }
      setQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [language]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = langCodeMap[language] || "en-IN";
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // History
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Risk Analyzer
  const [riskIngredients, setRiskIngredients] = useState("Ashwagandha, Neem, Tulsi");
  const [riskClassical, setRiskClassical] = useState(true);
  const [riskNovel, setRiskNovel] = useState(false);
  const [riskResult, setRiskResult] = useState<any>(null);
  const [isCalcRisk, setIsCalcRisk] = useState(false);

  // Defensive Pub
  const [defPubResult, setDefPubResult] = useState<any>(null);

  // ABS Simulator
  const [absIngredients, setAbsIngredients] = useState("Ashwagandha, Turmeric");
  const [absCommercial, setAbsCommercial] = useState(true);
  const [absTK, setAbsTK] = useState(true);
  const [absResult, setAbsResult] = useState<any>(null);
  const [isCalcAbs, setIsCalcAbs] = useState(false);

  // Timestamping
  const [tsText, setTsText] = useState("");
  const [tsResult, setTsResult] = useState<any>(null);

  // Pathway Matrix
  const [matrixData, setMatrixData] = useState<any[]>([]);

  // What-If Sandbox
  const [wifIngredients, setWifIngredients] = useState("Ashwagandha, Neem");
  const [wifClassical, setWifClassical] = useState(true);
  const [wifNovel, setWifNovel] = useState(false);
  const [wifResult, setWifResult] = useState<any>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (activeTab === "history" && loggedInUser) loadHistory(); }, [activeTab]);
  useEffect(() => { if (activeTab === "matrix") loadMatrix(); }, [activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try { const res = await fetch(`${API_URL}/api/auth/history/${loggedInUser.email}`); const data = await res.json(); setChatHistory(data.history || []); } catch {} finally { setIsLoadingHistory(false); }
  };
  const loadMatrix = async () => {
    try { const res = await fetch(`${API_URL}/api/pathway-matrix`); const data = await res.json(); setMatrixData(data.matrix || []); } catch {}
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Unified Query
  const handleQuerySubmit = async (text: string, appendContext = false) => {
    if (!text.trim()) return;
    
    const userText = text;
    setQuery(""); // CLEAR SEARCH BAR INSTANTLY
    setIsProcessing(true);
    
    const currentContext = appendContext ? `${chatContext}\nUser chose/said: ${userText}` : "";
    setChatContext(currentContext);
    
    try {
      const res = await fetch(`${API_URL}/api/unified`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, context: currentContext, language, jurisdiction, persona, user_email: loggedInUser.email }),
      });
      const data = await res.json();
      setAgentResponse(data);
      if (data.action === "answer") { setChatContext(""); } else { setChatContext(`${currentContext}\nAgent asked: ${data.clarification_question}`); }
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch { alert("Error connecting to backend."); } finally { setIsProcessing(false); }
  };

  // Risk Score
  const handleRiskCalc = async () => {
    setIsCalcRisk(true);
    setDefPubResult(null); // Clear old defensive publication
    try {
      const res = await fetch(`${API_URL}/api/risk-score`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: riskIngredients.split(",").map(s=>s.trim()), classical_text: riskClassical, novel_processing: riskNovel }),
      });
      setRiskResult(await res.json());
    } catch { alert("Backend error"); } finally { setIsCalcRisk(false); }
  };

  // Defensive Pub
  const handleDefPub = async () => {
    const ingredients = riskResult ? riskResult.classification?.tkdl_overlap || ["Ashwagandha"] : ["Ashwagandha"];
    try {
      const res = await fetch(`${API_URL}/api/defensive-pub`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: riskIngredients.split(",").map(s=>s.trim()), method: "", prior_art: "", classical_text: riskClassical, novel_processing: riskNovel }),
      });
      setDefPubResult(await res.json());
    } catch { alert("Backend error"); }
  };

  // ABS
  const handleABS = async () => {
    setIsCalcAbs(true);
    try {
      const res = await fetch(`${API_URL}/api/abs-simulate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: absIngredients.split(",").map(s=>s.trim()), is_commercial: absCommercial, uses_traditional_knowledge: absTK }),
      });
      setAbsResult(await res.json());
    } catch { alert("Backend error"); } finally { setIsCalcAbs(false); }
  };

  // Timestamp
  const handleTimestamp = async () => {
    if (!tsText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/timestamp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disclosure_text: tsText }),
      });
      setTsResult(await res.json());
    } catch { alert("Backend error"); }
  };

  // What-If Sandbox
  const handleWhatIf = async () => {
    try {
      const res = await fetch(`${API_URL}/api/risk-score`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: wifIngredients.split(",").map(s=>s.trim()), classical_text: wifClassical, novel_processing: wifNovel }),
      });
      setWifResult(await res.json());
    } catch {}
  };
  useEffect(() => { if (activeTab === "sandbox") handleWhatIf(); }, [wifIngredients, wifClassical, wifNovel, activeTab]);

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <li onClick={() => setActiveTab(id)} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${activeTab === id ? "bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/20" : "text-slate-300 hover:bg-slate-800"}`}>
      <Icon className="w-4 h-4 shrink-0"/> {label}
    </li>
  );

  const getBandColor = (c: string) => c === "green" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : c === "amber" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-rose-700 bg-rose-50 border-rose-200";
  const getGaugeColor = (c: string) => c === "green" ? "border-emerald-500" : c === "amber" ? "border-amber-500" : "border-rose-500";

  if (!loggedInUser) return <AuthScreen onLoginSuccess={(user) => setLoggedInUser(user)} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col h-screen overflow-y-auto shrink-0">
        <div className="flex items-center gap-3 p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <Shield className="w-7 h-7 text-emerald-400 shrink-0" />
          <div><h1 className="text-lg font-bold leading-tight">IP-Shakti Sahayak</h1><p className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">v2.0 Production</p></div>
        </div>
        <div className="p-3 space-y-5 flex-1">
          <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-2">Intelligence Hub</p><ul className="space-y-0.5"><SidebarItem id="unified" icon={Bot} label="Agentic Decision Engine" /><SidebarItem id="history" icon={Clock} label="My Chat History" /></ul></div>
          <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-2">Risk & Analysis</p><ul className="space-y-0.5"><SidebarItem id="risk" icon={AlertTriangle} label="Risk Analyzer (0-100)" /><SidebarItem id="sandbox" icon={Layers} label="What-If Sandbox" /><SidebarItem id="matrix" icon={Table} label="Pathway Matrix" /></ul></div>
          <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-2">Protection Tools</p><ul className="space-y-0.5"><SidebarItem id="defensive" icon={FileText} label="Defensive Publication" /><SidebarItem id="abs" icon={Calculator} label="ABS Simulator" /><SidebarItem id="timestamp" icon={Fingerprint} label="SHA-256 Timestamping" /></ul></div>
          <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-2">Visualizers</p><ul className="space-y-0.5"><SidebarItem id="graph" icon={Network} label="Knowledge Graph" /><SidebarItem id="calendar" icon={CalendarDays} label="Compliance Calendar" /><SidebarItem id="prefill" icon={Edit3} label="Form Pre-Filler" /></ul></div>
        </div>
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm uppercase">{loggedInUser.name.charAt(0)}</div><div><p className="text-xs font-bold truncate capitalize">{loggedInUser.name}</p><p className="text-[10px] text-slate-400 capitalize">{loggedInUser.role}</p></div></div>
          <button onClick={() => setLoggedInUser(null)} className="p-1.5 text-slate-400 hover:text-rose-400"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
          <h2 className="font-bold text-slate-800 hidden md:block">IP-Shakti Sahayak</h2>
          <div className="flex items-center gap-3 ml-auto">
            {/* Persona Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button onClick={()=>setPersona("innovator")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${persona==="innovator"?"bg-white text-indigo-700 shadow-sm":"text-slate-500"}`}>Innovator</button>
              <button onClick={()=>setPersona("tk_holder")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${persona==="tk_holder"?"bg-white text-emerald-700 shadow-sm":"text-slate-500"}`}>TK Holder</button>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200"><Languages className="w-3 h-3 text-slate-500 ml-1.5" /><select value={language} onChange={e=>setLanguage(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"><option value="English">English</option><option value="Hindi">हिंदी</option><option value="Tamil">தமிழ்</option><option value="Telugu">తెలుగు</option><option value="Marathi">मराठी</option><option value="Bengali">বাংলা</option><option value="Gujarati">ગુજરાતી</option><option value="Kannada">ಕನ್ನಡ</option><option value="Malayalam">മലയാളം</option><option value="Sanskrit">संस्कृत</option></select></div>
            <div className="flex items-center gap-1 bg-indigo-50 rounded-lg p-0.5 border border-indigo-200"><Globe className="w-3 h-3 text-indigo-500 ml-1.5" /><select value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)} className="bg-transparent text-xs font-bold text-indigo-700 outline-none cursor-pointer pr-1"><option value="India">India</option><option value="International">International</option></select></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ==================== TAB: UNIFIED ==================== */}
          {activeTab === "unified" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Bot className="w-6 h-6 text-indigo-600" /> What are you working on today?</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(query, false); }}>
                  <div className="relative flex items-center">
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-6 pr-28 py-5 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-slate-800 font-medium bg-slate-50" placeholder={`Ask in ${language} about ${jurisdiction} IP laws...`} disabled={isProcessing} />
                    
                    {voiceSupported && (
                      <button type="button" onClick={toggleVoice} className={`absolute right-16 p-3 rounded-xl transition-colors ${isListening ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-200" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} title={isListening ? "Stop listening" : "Start voice input"}>
                        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                      </button>
                    )}
                    
                    <button type="submit" disabled={isProcessing || (!query.trim() && !isListening)} className="absolute right-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                  </div>
                </form>
              </div>
              {isProcessing && <div className="flex flex-col items-center p-12 bg-white rounded-2xl border border-slate-200"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /><p className="mt-4 font-bold text-slate-700">Analyzing under {jurisdiction} Law ({language})...</p></div>}
              <div ref={resultsRef}></div>
              {agentResponse?.action === "clarify" && !isProcessing && (
                <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-200"><div className="flex gap-4"><div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0"><Bot size={24} /></div><div><h3 className="text-xl font-bold text-indigo-900 mb-2">I need more information...</h3><p className="text-indigo-800 text-lg mb-6 font-medium">{agentResponse.clarification_question}</p>{agentResponse.clarification_options && <div className="flex flex-wrap gap-3">{agentResponse.clarification_options.map((opt: string, i: number) => (<button key={i} onClick={() => handleQuerySubmit(opt, true)} className="px-6 py-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold border-2 border-indigo-200 rounded-xl transition-all">{opt}</button>))}</div>}</div></div></div>
              )}
              {agentResponse?.action === "answer" && !isProcessing && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-emerald-200 relative overflow-hidden"><div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div><h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Executive Summary</h3><div className="bg-emerald-50 text-emerald-900 p-5 rounded-xl border border-emerald-100 font-medium text-lg">{agentResponse.short_answer}</div>{agentResponse.confidence && <p className="mt-3 text-sm text-slate-500">Confidence: <span className={`font-bold ${agentResponse.confidence==="high"?"text-emerald-600":agentResponse.confidence==="medium"?"text-amber-600":"text-rose-600"}`}>{agentResponse.confidence.toUpperCase()}</span></p>}</div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200"><h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6 flex items-center gap-2"><FileText className="text-indigo-600" /> Detailed Analysis ({jurisdiction})</h3><div className="prose prose-slate max-w-none"><ReactMarkdown>{agentResponse.detailed_answer}</ReactMarkdown></div></div>
                    <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl text-white"><h3 className="font-bold flex items-center gap-2 mb-6 text-slate-200 border-b border-slate-700 pb-4"><BookOpen className="text-emerald-400" /> Sources</h3><ul className="space-y-4">{agentResponse.sources?.map((c: string, i: number) => (<li key={i} className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span>{c}</span></li>))}</ul></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: HISTORY ==================== */}
          {activeTab === "history" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {isLoadingHistory ? <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div> : chatHistory.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-3xl border border-slate-200"><Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-700">No Chat History</h3><p className="text-slate-500">Your queries will be saved here.</p></div>
              ) : chatHistory.map((chat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                  <p className="text-xs text-slate-400 font-mono">{chat.timestamp}</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="font-bold text-slate-700">{chat.query}</p></div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"><p className="font-medium text-emerald-900">{chat.response.short_answer}</p></div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB: RISK ANALYZER ==================== */}
          {activeTab === "risk" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-rose-500" /> Biopiracy & Section 3(p) Risk Analyzer</h3>
                <input type="text" value={riskIngredients} onChange={e=>setRiskIngredients(e.target.value)} className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl mb-4 text-lg font-medium outline-none focus:border-rose-400" placeholder="Enter ingredients (comma-separated)..." />
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${riskClassical ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={riskClassical} onChange={e=>setRiskClassical(e.target.checked)} className="hidden" />{riskClassical ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>} Classical Text</label>
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${riskNovel ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={riskNovel} onChange={e=>setRiskNovel(e.target.checked)} className="hidden" />{riskNovel ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>} Novel Processing</label>
                  <button onClick={handleRiskCalc} disabled={isCalcRisk} className="ml-auto px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2">{isCalcRisk ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertTriangle className="w-4 h-4"/>} Calculate Risk</button>
                </div>
              </div>
              {riskResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                    <h3 className="font-bold text-slate-800 text-lg mb-6">Risk Score</h3>
                    <div className="relative flex justify-center items-center mb-4"><div className="w-48 h-24 overflow-hidden relative"><div className={`w-48 h-48 rounded-full border-[20px] absolute bottom-0 border-b-transparent border-r-transparent transition-transform duration-1000 ${getGaugeColor(riskResult.risk.color)}`} style={{ transform: `rotate(${-45 + (riskResult.risk.score / 100) * 180}deg)` }}></div><div className="w-48 h-48 rounded-full border-[20px] border-slate-100 absolute bottom-0 border-b-transparent border-r-transparent -z-10 rotate-[135deg]"></div></div><div className="absolute bottom-0 text-4xl font-black text-slate-800">{riskResult.risk.score}</div></div>
                    <div className={`py-2 rounded-lg text-sm font-bold border ${getBandColor(riskResult.risk.color)}`}>{riskResult.risk.band}</div>
                    <div className="mt-4 text-left space-y-2">{riskResult.risk.factors.map((f: string, i: number) => <p key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">📊 {f}</p>)}</div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Classification (Rules Engine)</h3>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4"><p className="text-2xl font-black text-indigo-800">{riskResult.classification.category}</p><p className="text-sm text-indigo-600 mt-2">{riskResult.classification.reasoning}</p></div>
                    <div className="space-y-3">
                      <div><p className="text-xs font-bold text-slate-500 uppercase">IP Routes Available</p><div className="flex flex-wrap gap-2 mt-1">{riskResult.classification.ip_routes.map((r: string, i: number) => <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">{r}</span>)}</div></div>
                      <div><p className="text-xs font-bold text-slate-500 uppercase">Regulatory Path</p><p className="text-sm text-slate-700 mt-1">{riskResult.classification.regulatory_path}</p></div>
                      <div><p className="text-xs font-bold text-slate-500 uppercase">TKDL Overlap</p><p className="text-sm text-slate-700 mt-1">{riskResult.classification.tkdl_ratio}% ({riskResult.classification.tkdl_overlap.join(", ") || "None"})</p></div>
                    </div>
                    {riskResult.risk.score > 60 && <button onClick={handleDefPub} className="mt-4 w-full py-3 bg-rose-600 text-white font-bold rounded-lg flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Generate Defensive Publication</button>}
                  </div>
                </div>
              )}
              {defPubResult && <div className="bg-slate-900 p-6 rounded-2xl text-white"><h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-400"/> Defensive Publication Generated</h3><pre className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-800 p-4 rounded-lg overflow-auto max-h-96">{defPubResult.publication.document}</pre><div className="mt-4 grid grid-cols-2 gap-4"><div className="bg-slate-800 p-3 rounded-lg"><p className="text-[10px] text-slate-500 uppercase font-bold">SHA-256 Hash</p><p className="text-xs text-emerald-400 font-mono break-all mt-1">{defPubResult.publication.sha256_hash}</p></div><div className="bg-slate-800 p-3 rounded-lg"><p className="text-[10px] text-slate-500 uppercase font-bold">Timestamp</p><p className="text-xs text-emerald-400 font-mono mt-1">{defPubResult.publication.timestamp}</p></div></div>
              <button onClick={() => downloadFile("Defensive_Publication.txt", defPubResult.publication.document)} className="mt-6 w-full py-3 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"><Download className="w-5 h-5"/> Download Document File</button>
              </div>}
            </div>
          )}

          {/* ==================== TAB: WHAT-IF SANDBOX ==================== */}
          {activeTab === "sandbox" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><Layers className="text-purple-600" /> What-If Live Reclassification Sandbox</h3>
                <p className="text-sm text-slate-500 mb-4">Tweak any variable and watch the classification & risk score update instantly.</p>
                <input type="text" value={wifIngredients} onChange={e=>{setWifIngredients(e.target.value)}} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-3 font-medium outline-none focus:border-purple-400" />
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${wifClassical ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={wifClassical} onChange={e=>setWifClassical(e.target.checked)} className="hidden" /> Classical Text</label>
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${wifNovel ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={wifNovel} onChange={e=>setWifNovel(e.target.checked)} className="hidden" /> Novel Processing</label>
                </div>
              </div>
              {wifResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                    <p className="text-5xl font-black" style={{color: wifResult.risk.color === "green" ? "#059669" : wifResult.risk.color === "amber" ? "#d97706" : "#dc2626"}}>{wifResult.risk.score}</p>
                    <p className={`mt-2 py-1 rounded-lg text-sm font-bold border ${getBandColor(wifResult.risk.color)}`}>{wifResult.risk.band}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <p className="text-2xl font-black text-indigo-800">{wifResult.classification.category}</p>
                    <p className="text-sm text-slate-600 mt-2">{wifResult.classification.reasoning}</p>
                    <div className="flex flex-wrap gap-2 mt-3">{wifResult.classification.ip_routes.map((r: string, i: number) => <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">{r}</span>)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: DEFENSIVE PUB ==================== */}
          {activeTab === "defensive" && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
                <FileText className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
                <h2 className="text-3xl font-black text-slate-800 mb-4">Defensive Publication Generator</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Protect India's Traditional Knowledge from biopiracy. A Defensive Publication creates an official, public record of <strong>"Prior Art."</strong> By mathematically timestamping your traditional formulation, you legally block foreign companies or competitors from ever patenting it.
                </p>
                <button onClick={() => setActiveTab("risk")} className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-md transition-all">
                  Go to Risk Analyzer to Start
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black mb-4">1</div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg">Run Risk Analysis</h3>
                  <p className="text-sm text-slate-600">Enter your herbs into our Rules Engine. If the system detects Traditional Knowledge (High Risk of Section 3(p) rejection), it will unlock the Defensive Publication option.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black mb-4">2</div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg">Auto-Generate Document</h3>
                  <p className="text-sm text-slate-600">With one click, the system instantly drafts a legally sound disclosure document containing your ingredients, processing method, and relevant TKDL citations.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-black mb-4">3</div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg">Cryptographic Seal</h3>
                  <p className="text-sm text-slate-600">The document is permanently locked with an unbreakable <strong>SHA-256 Hash</strong> and ISO Timestamp. This creates mathematically provable evidence of Prior Art for Patent Offices worldwide.</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: ABS SIMULATOR ==================== */}
          {activeTab === "abs" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator className="text-orange-500" /> ABS Benefit-Sharing Simulator</h3>
                <input type="text" value={absIngredients} onChange={e=>setAbsIngredients(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-3 font-medium outline-none" placeholder="Enter biological resources..." />
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${absCommercial ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={absCommercial} onChange={e=>setAbsCommercial(e.target.checked)} className="hidden" /> Commercial Use</label>
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-bold border ${absTK ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-slate-200 text-slate-500"}`}><input type="checkbox" checked={absTK} onChange={e=>setAbsTK(e.target.checked)} className="hidden" /> Uses Traditional Knowledge</label>
                  <button onClick={handleABS} disabled={isCalcAbs} className="ml-auto px-6 py-2 bg-orange-600 text-white font-bold rounded-lg">{isCalcAbs ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simulate"}</button>
                </div>
              </div>
              {absResult && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                    <p className="font-bold text-orange-800 text-lg mb-2">Estimated Benefit-Sharing: <span className="text-2xl">{absResult.estimated_benefit_sharing}</span></p>
                    <p className="text-sm text-orange-700">Applicable Law: {absResult.applicable_law}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4">Compliance Checklist</h4>
                    {absResult.checklist.map((item: any, i: number) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg mb-2 ${item.required ? "bg-rose-50 border border-rose-100" : "bg-emerald-50 border border-emerald-100"}`}>
                        {item.required ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/>}
                        <div><p className="font-bold text-sm text-slate-800">{item.item}</p><p className="text-xs text-slate-500">{item.reason}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: TIMESTAMPING ==================== */}
          {activeTab === "timestamp" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Fingerprint className="text-violet-600" /> Tamper-Evident Disclosure Timestamping</h3>
                <textarea value={tsText} onChange={e=>setTsText(e.target.value)} rows={6} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none resize-none font-medium" placeholder="Paste your TK disclosure, formulation description, or any text you want to timestamp..." />
                <button onClick={handleTimestamp} className="mt-3 px-6 py-2 bg-violet-600 text-white font-bold rounded-lg flex items-center gap-2"><Hash className="w-4 h-4"/> Generate SHA-256 Proof</button>
              </div>
              {tsResult && (
                <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 /> Proof Generated Successfully</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">SHA-256 Hash</p><p className="text-sm text-emerald-400 font-mono break-all">{tsResult.content_hash}</p></div>
                    <div className="bg-slate-800 p-4 rounded-lg"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timestamp (UTC)</p><p className="text-sm text-emerald-400 font-mono">{tsResult.timestamp}</p></div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Verification String</p><p className="text-xs text-slate-300 font-mono break-all">{tsResult.verification_string}</p></div>
                  <p className="text-xs text-slate-400">{tsResult.status}</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: PATHWAY MATRIX ==================== */}
          {activeTab === "matrix" && (
            <div className="max-w-6xl mx-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Table className="text-blue-600" /> Regulatory Pathway Comparison Matrix</h3>
              <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-200">{["Category", "Filing Cost", "Time to Market", "Evidence Required", "IP Options", "ABS Obligation", "Patent Feasibility"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-slate-600 text-xs uppercase">{h}</th>)}</tr></thead>
                  <tbody>{matrixData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-indigo-700">{row.category}</td>
                      <td className="px-4 py-3">{row.filing_cost}</td>
                      <td className="px-4 py-3">{row.time_to_market}</td>
                      <td className="px-4 py-3 text-xs">{row.evidence_required}</td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{row.ip_options.map((o: string, j: number) => <span key={j} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">{o}</span>)}</div></td>
                      <td className="px-4 py-3">{row.abs_obligation}</td>
                      <td className="px-4 py-3">{row.patent_feasibility}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB: KNOWLEDGE GRAPH ==================== */}
          {activeTab === "graph" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Network className="text-cyan-600" /> Ayurvedic Formulation Knowledge Graph</h3>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="space-y-4">
                    {[{from: "Product", rel: "CONTAINS", to: "Ingredient", color: "bg-indigo-100 text-indigo-700 border-indigo-200"},
                      {from: "Ingredient", rel: "SOURCED_FROM", to: "Biological Resource", color: "bg-emerald-100 text-emerald-700 border-emerald-200"},
                      {from: "Biological Resource", rel: "GOVERNED_BY", to: "Biodiversity Act 2002", color: "bg-orange-100 text-orange-700 border-orange-200"},
                      {from: "Product", rel: "MAY_USE", to: "Traditional Knowledge (TKDL)", color: "bg-violet-100 text-violet-700 border-violet-200"},
                      {from: "Product", rel: "PROTECTABLE_VIA", to: "Patent / GI / Trademark", color: "bg-blue-100 text-blue-700 border-blue-200"},
                      {from: "Patent", rel: "BLOCKED_BY", to: "Section 3(p) Prior Art", color: "bg-rose-100 text-rose-700 border-rose-200"},
                    ].map((edge, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${edge.color}`}>{edge.from}</span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">──{edge.rel}──→</span>
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${edge.color}`}>{edge.to}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">This knowledge graph visualizes the legal relationships between Ayurvedic products, ingredients, biological resources, and applicable IP/regulatory frameworks.</p>
              </div>
            </div>
          )}

          {/* ==================== TAB: COMPLIANCE CALENDAR ==================== */}
          {activeTab === "calendar" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><CalendarDays className="text-teal-600" /> IP Portfolio & Compliance Calendar</h3>
              {[{title: "Patent Annual Fee (Year 3)", date: "2027-03-15", status: "Upcoming", color: "border-amber-200 bg-amber-50"}, {title: "Trademark Renewal — IP-Shakti Brand", date: "2036-09-01", status: "Active", color: "border-emerald-200 bg-emerald-50"}, {title: "GI Compliance Audit", date: "2027-06-30", status: "Upcoming", color: "border-amber-200 bg-amber-50"}, {title: "NBA ABS Report Submission", date: "2027-01-31", status: "Urgent", color: "border-rose-200 bg-rose-50"}, {title: "FSSAI License Renewal", date: "2028-12-31", status: "Active", color: "border-emerald-200 bg-emerald-50"}].map((item, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${item.color} flex items-center justify-between`}>
                  <div><p className="font-bold text-slate-800">{item.title}</p><p className="text-sm text-slate-500 mt-1">Due: {item.date}</p></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "Urgent" ? "bg-rose-600 text-white" : item.status === "Upcoming" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{item.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB: FORM PRE-FILLER ==================== */}
          {activeTab === "prefill" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Edit3 className="text-pink-600" /> AI-Powered Form Pre-Filler</h3>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <p className="text-sm text-slate-500">Based on your product profile, the system pre-fills relevant IP India application fields.</p>
                {[{label: "Form 1 — Patent Application", fields: [{k:"Title of Invention", v:"Novel Ayurvedic Formulation for [Auto-filled from product profile]"},{k:"Applicant Name", v: loggedInUser.name},{k:"Applicant Type", v: loggedInUser.role === "startup" ? "Startup (eligible for 80% fee reduction)" : "Individual"},{k:"Field of Invention", v:"Traditional Medicine / Ayurveda"},{k:"Priority Date", v: new Date().toISOString().split("T")[0]}]},
                 {label: "Form TM-A — Trademark Application", fields: [{k:"Mark Type", v:"Word Mark"},{k:"Class", v:"Class 5 (Pharmaceutical / Ayurvedic)"},{k:"Applicant", v: loggedInUser.name},{k:"State", v:"To be filled"}]}
                ].map((form, fi) => (
                  <div key={fi} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-3">{form.label}</h4>
                    <div className="space-y-2">{form.fields.map((f, i) => (
                      <div key={i} className="flex items-center gap-4"><span className="text-xs font-bold text-slate-500 w-40 shrink-0">{f.k}:</span><span className="text-sm text-slate-800 bg-white px-3 py-1 rounded border border-slate-200 flex-1">{f.v}</span></div>
                    ))}</div>
                  </div>
                ))}
                <button onClick={() => downloadFile("Draft_IP_Forms.txt", `FORM 1 - PATENT APPLICATION\nApplicant: ${loggedInUser.name}\nType: ${loggedInUser.role}\n\nFORM TM-A - TRADEMARK\nApplicant: ${loggedInUser.name}\nClass: 5 (Ayurvedic)\n\n[DRAFT GENERATED BY IP-SHAKTI SAHAYAK]`)} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"><Download className="w-4 h-4"/> Download as Draft</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
