import React, { useState, useRef, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import GlassPanel from "./GlassPanel";
import { ChatMessage, RoadmapData, CareerPathData, StartupUniverseData } from "../types";
import { 
  Send, Brain, Cpu, Network, Target, Award, Play, CheckCircle2, 
  MapPin, AlertCircle, Sparkles, Plus, DollarSign, Activity, FileText
} from "lucide-react";

interface AICorePortalProps {
  sector: 'general' | 'roadmap' | 'career' | 'startup';
}

export default function AICorePortal({ sector }: AICorePortalProps) {
  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General Chat values
  const [chatInput, setChatInput] = useState("");
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "core",
      text: "TRANSMISSION SECURE: NeuroVerse AI Core online and synchronized. Enter structural queries to reshape sector parameters or allocate cognitive pathways.",
      timestamp: new Date().toLocaleTimeString(),
      category: "general"
    }
  ]);

  // Roadmap values
  const [roadmapTopic, setRoadmapTopic] = useState("");
  const [roadmapResult, setRoadmapResult] = useState<RoadmapData | null>(null);

  // Career values
  const [careerRole, setCareerRole] = useState("");
  const [careerResult, setCareerResult] = useState<CareerPathData | null>(null);

  // Startup values
  const [startupSector, setStartupSector] = useState("");
  const [startupResult, setStartupUniverse] = useState<StartupUniverseData | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLogs]);

  // Trigger sound effect when sector changes inside client UI
  useEffect(() => {
    soundEngine.playSweep();
  }, [sector]);

  // Handle General Core Chat Transmission
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    soundEngine.playTransmissionPulse();
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatLogs(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-core/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          chatHistory: chatLogs.slice(-6) // include brief context
        })
      });

      if (!response.ok) throw new Error("AI Core link degraded.");
      const data = await response.json();

      soundEngine.playAlert(); // alert node synchronized successfully
      setChatLogs(prev => [...prev, {
        id: Math.random().toString(),
        sender: "core",
        text: data.text,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err: any) {
      setError(err?.message || "Communication links disrupted.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Generating Custom Roadmap Timeline
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    const topic = roadmapTopic.trim() || "Virtual WebGL Design";
    
    soundEngine.playTransmissionPulse();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-core/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) throw new Error("Could not formulate roadmap layout.");
      const data = await response.json();
      
      soundEngine.playClick();
      setRoadmapResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed neural vector mapping.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Career Mappings
  const handleGenerateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = careerRole.trim() || "Web3 Smart Contract Security Agent";

    soundEngine.playTransmissionPulse();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-core/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });

      if (!response.ok) throw new Error("Career vector mapping offline.");
      const data = await response.json();

      soundEngine.playClick();
      setCareerResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to catalog job matrix.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Startup Ideas Generation
  const handleGenerateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetSector = startupSector.trim() || "Carbon Capture SaaS";

    soundEngine.playTransmissionPulse();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-core/startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: targetSector })
      });

      if (!response.ok) throw new Error("Silicon orbit disrupted.");
      const data = await response.json();

      soundEngine.playClick();
      setStartupUniverse(data);
    } catch (err: any) {
      setError(err?.message || "Startup vectors failed to launch.");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-sky-500/10 text-sky-400 border border-sky-400/30";
      case "Intermediate": return "bg-orange-500/10 text-orange-400 border border-orange-400/30";
      default: return "bg-rose-500/10 text-rose-400 border border-rose-400/30";
    }
  };

  return (
    <div className="w-full">
      {/* --------------------------------------------------------- */}
      {/* SECTION 1: GENERAL TRANSMISSION (Chat with Core)         */}
      {/* --------------------------------------------------------- */}
      {sector === "general" && (
        <GlassPanel 
          title="Core Uplink Interface" 
          subtitle="Direct synaptic interaction with AI OS Central Intellect"
          tag="CORE_TRANS_LINK"
          accentColor="cyan"
        >
          <div className="flex flex-col h-[340px]">
            {/* Scrollable messages log */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar">
              {chatLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex flex-col max-w-[85%] ${log.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <p className="text-[9px] text-[#94a3b8]/40 px-1 font-mono">{log.timestamp}</p>
                  <div className={`p-3 rounded-xl mt-1 text-xs border ${
                    log.sender === 'user'
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-200"
                      : "bg-slate-950/80 border-slate-800 text-slate-300"
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-cyan-400/60 animate-pulse text-[11px] font-mono">
                  <Brain className="w-3.5 h-3.5 animate-spin" />
                  <span>Modulating hyper-dimensional responses...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2 text-rose-400 text-[11px] font-mono bg-rose-500/5 p-2 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Prompt input Form */}
            <form onSubmit={handleChatSend} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Transmit queries to the AI Core..."
                className="flex-1 bg-black/50 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-xs text-cyan-300 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400/60 font-mono"
              />
              <button
                type="submit"
                className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </GlassPanel>
      )}

      {/* --------------------------------------------------------- */}
      {/* SECTION 2: LEARNING PORTAL (Roadmap Display)             */}
      {/* --------------------------------------------------------- */}
      {sector === "roadmap" && (
        <div className="space-y-4">
          <GlassPanel 
            title="Roadmap Compiler" 
            subtitle="Request synthesized cognitive timelines" 
            tag="EDU_SYS_ALIGNED"
            accentColor="emerald"
          >
            <form onSubmit={handleGenerateRoadmap} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={roadmapTopic}
                onChange={(e) => setRoadmapTopic(e.target.value)}
                placeholder="e.g. Real-Time Spatial Shaders, Rust Core Assembly..."
                className="flex-1 bg-black/50 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-xs text-emerald-300 placeholder-emerald-500/30 focus:outline-none focus:border-emerald-400/60 font-mono"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-sans font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                {loading ? "Compiling..." : "SYNTH RELAY"}
              </button>
            </form>
          </GlassPanel>

          {/* Result Output Timeline nodes */}
          {roadmapResult && (
            <GlassPanel
              title={roadmapResult.topic}
              subtitle="COGNITIVE ROADMAP LAYOUT SYNCHRONIZED"
              tag="EDU_PATH_SECURE"
              accentColor="emerald"
            >
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-sans italic border-l-2 border-emerald-500/40 pl-3">
                  {roadmapResult.overview}
                </p>

                {/* Milestones nodes */}
                <div className="relative border-l border-emerald-500/20 ml-2.5 pl-5 space-y-6 mt-4">
                  {roadmapResult.steps.map((st, idx) => (
                    <div key={st.id} className="relative group/step">
                      {/* Node circle */}
                      <span className="absolute -left-[26px] top-1 flex items-center justify-center w-3 h-3 rounded-full bg-slate-950 border border-emerald-400 group-hover/step:bg-emerald-400 transition-colors">
                        <span className="w-1 h-3.5 hidden group-hover/step:inline -mt-1 bg-emerald-400" />
                      </span>
                      
                      {/* Step content */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{st.phase}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${getDifficultyBadgeColor(st.difficulty)}`}>
                            {st.difficulty}
                          </span>
                        </div>
                        <h4 className="text-white text-xs font-bold font-sans mt-0.5 tracking-wide group-hover/step:text-emerald-300 transition-colors">
                          {st.title}
                        </h4>
                        <p className="text-[#94a3b8]/80 text-[11px] mt-1 leading-relaxed">
                          {st.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          )}
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* SECTION 3: CAREER VECTOR (Skill Analytics Display)       */}
      {/* --------------------------------------------------------- */}
      {sector === "career" && (
        <div className="space-y-4">
          <GlassPanel 
            title="Career Vector Allocator" 
            subtitle="Map futuristic skills and measure market indices" 
            tag="CAREER_VEC_ANAL"
            accentColor="indigo"
          >
            <form onSubmit={handleGenerateCareer} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={careerRole}
                onChange={(e) => setCareerRole(e.target.value)}
                placeholder="e.g. Autonomous Drone Swarm Fleet Operator..."
                className="flex-1 bg-black/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-xs text-indigo-300 placeholder-indigo-500/30 focus:outline-none focus:border-indigo-400/60 font-mono"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-sans font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Network className="w-3.5 h-3.5 animate-pulse" />
                {loading ? "Allocating..." : "MAP VECTORS"}
              </button>
            </form>
          </GlassPanel>

          {/* Analytical Skill Trees output */}
          {careerResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job readiness radial gauge placeholder */}
              <GlassPanel 
                title="Readiness Status" 
                subtitle="AGGREGATED VECTOR CALIBRATION"
                tag="JOB_READ_INDEX"
                accentColor="indigo"
                className="md:col-span-1"
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Glowing outer progress circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-400 animate-spin" style={{ animationDuration: "8s" }} />
                    <div className="text-center">
                      <span className="text-3xl font-black text-white">{careerResult.jobReadinessScore}%</span>
                      <p className="text-[8px] font-mono text-[#94a3b8]/50 uppercase mt-0.5">Vector Match</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4 px-2 italic">
                    {careerResult.forecast}
                  </p>
                </div>
              </GlassPanel>

              {/* Skills breakdown bars */}
              <GlassPanel 
                title={careerResult.roleName} 
                subtitle="SKILL VECTOR MATRIX METRICS"
                tag="SKILLS_ALLOC_MET"
                accentColor="indigo"
                className="md:col-span-2"
              >
                <div className="space-y-4">
                  {careerResult.skills.map((sk, idx) => (
                    <div key={idx} className="space-y-1.5 group/skill">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 group-hover/skill:text-indigo-300 transition-colors">{sk.name}</span>
                        <div className="flex items-center space-x-2 font-mono text-[10px]">
                          <span className={`px-1 py-0.2 rounded text-[8px] uppercase tracking-wider ${
                            sk.marketDemand === 'Critical' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          }`}>
                            {sk.marketDemand} Demand
                          </span>
                          <span className="text-indigo-400 font-bold">{sk.level}%</span>
                        </div>
                      </div>
                      
                      {/* Progress matrix bar */}
                      <div className="w-full h-1.5 bg-slate-950/80 rounded-full border border-indigo-500/10 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_8px_#6366f1] transition-all duration-500"
                          style={{ width: `${sk.level}%` }}
                        />
                      </div>

                      {/* Micro recommended projects */}
                      <div className="pl-2 border-l border-indigo-500/20 space-y-0.5 mt-1 text-[9px] text-[#94a3b8]/70">
                        {sk.projectsRecommended.map((proj, pi) => (
                          <p key={pi} className="truncate">• Recommend Project: {proj}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* SECTION 4: VENTURE BUILDER (Startup Planet Display)     */}
      {/* --------------------------------------------------------- */}
      {sector === "startup" && (
        <div className="space-y-4">
          <GlassPanel 
            title="Startup Architect" 
            subtitle="Construct market vectors and compute orbit designs" 
            tag="STARTUP_GRID_ENG"
            accentColor="amber"
          >
            <form onSubmit={handleGenerateStartup} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={startupSector}
                onChange={(e) => setStartupSector(e.target.value)}
                placeholder="e.g. Decentralized Fusion Grid Management SaaS..."
                className="flex-1 bg-black/50 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-amber-300 placeholder-amber-500/30 focus:outline-none focus:border-amber-400/60 font-mono"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/40 font-sans font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                {loading ? "Architecting..." : "DEPLOY VENTURE"}
              </button>
            </form>
          </GlassPanel>

          {/* Deployed Venture ideas orbiting cards */}
          {startupResult && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 tracking-wide uppercase px-1.5 py-1 bg-amber-500/5 rounded-lg border border-amber-500/15 w-fit">
                <MapPin className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Planetary Hub: {startupResult.planetName} Deployed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startupResult.ideas.map((idea, idx) => (
                  <GlassPanel
                    key={idx}
                    title={idea.title}
                    subtitle="ORBIT MODULE SPECIFICATION"
                    tag={`SAT_IDEA_0${idx+1}`}
                    accentColor="amber"
                  >
                    <div className="space-y-3.5">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {idea.concept}
                      </p>

                      {/* financial charts indicators placeholder */}
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                        <div className="bg-slate-950/80 border border-amber-500/15 p-2 rounded-xl">
                          <span className="text-amber-400/50 block uppercase text-[8px] tracking-widest mb-0.5">Projection (ARR)</span>
                          <span className="text-white font-bold flex items-center justify-center"><DollarSign className="w-3.5 h-3.5 text-emerald-400 -mr-0.5" />{idea.revenueProjections.replace("$", "")}</span>
                        </div>
                        <div className="bg-slate-950/80 border border-amber-500/15 p-2 rounded-xl">
                          <span className="text-amber-400/50 block uppercase text-[8px] tracking-widest mb-0.5">Industry Size (TAM)</span>
                          <span className="text-white font-bold">{idea.marketSize}</span>
                        </div>
                      </div>

                      {/* Deployed Action blueprints checklist */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[8px] font-mono text-amber-500 block uppercase tracking-widest">TACTICAL ROADMAP MODULES</span>
                        {idea.actionItems.map((item, idii) => (
                          <div key={idii} className="flex items-start space-x-2 text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
