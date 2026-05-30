import React, { useState, useRef, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import NeuroVerseCanvas from "./components/NeuroVerseCanvas";
import Navbar from "./components/Navbar";
import AICorePortal from "./components/AICorePortal";
import GlassPanel from "./components/GlassPanel";
import { soundEngine } from "./components/SoundEngine";
import { 
  ChevronDown, Cpu, Network, Briefcase, Rocket, Terminal, 
  HelpCircle, Sparkles, Orbit, ShieldAlert, CheckCircle2 
} from "lucide-react";

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Trigger brief alert ticks if active chapter segment changes
  const prevChapterRef = useRef(1);
  useEffect(() => {
    if (bootComplete && activeChapter !== prevChapterRef.current) {
      soundEngine.playSweep();
      prevChapterRef.current = activeChapter;
    }
  }, [activeChapter, bootComplete]);

  // Monitor scroll ticks
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const pct = maxScroll > 0 ? scrollTop / maxScroll : 0;
    
    setCurrentScroll(pct);

    // Map scroll percentage to 1-5 chapters
    // Segment thresholds: Chapter 1 [0-20], Chapter 2 [20-40], Chapter 3 [40-60], Chapter 4 [60-80], Chapter 5 [80-100]
    let currentCh = 1;
    if (pct < 0.20) currentCh = 1;
    else if (pct < 0.45) currentCh = 2;
    else if (pct < 0.70) currentCh = 3;
    else if (pct < 0.90) currentCh = 4;
    else currentCh = 5;

    if (currentCh !== activeChapter) {
      setActiveChapter(currentCh);
    }
  };

  // Safe multi-checkpoint scroll router
  const scrollToChapter = (chapterNum: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      // Calculate target scroll coordinates proportionally
      // Chapter 1: 0, Chapter 2: 0.3, Chapter 3: 0.55, Chapter 4: 0.8, Chapter 5: 1.0 (approximative layout targets)
      let targetPct = 0;
      if (chapterNum === 1) targetPct = 0;
      else if (chapterNum === 2) targetPct = 0.3;
      else if (chapterNum === 3) targetPct = 0.55;
      else if (chapterNum === 4) targetPct = 0.8;
      else targetPct = 1.0;

      container.scrollTo({
        top: targetPct * maxScroll,
        behavior: "smooth"
      });
    }
  };

  // Launch CTA actions
  const handleLaunchSimulation = () => {
    soundEngine.playTransmissionPulse();
    soundEngine.playAlert();
    alert("TRANSMISSION ESTABLISHED: NeuroVerse AI has successfully bridged to your local system core coordinates. Sector alpha-one initializing.");
  };

  if (!bootComplete) {
    return <LoadingScreen onComplete={() => setBootComplete(true)} />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#020208] text-slate-100 font-sans">
      {/* 1. Immersive High performance 3D backdrop renderer */}
      <NeuroVerseCanvas currentScroll={currentScroll} activeChapter={activeChapter} />

      {/* 2. Panoramic scan lines overlay for that visual hologram TV feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90.1deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] pointer-events-none z-10 bg-[size:100%_4px,6px_100%]" />

      {/* 3. Floating HUD Glass Header Menu */}
      <Navbar activeChapter={activeChapter} onNavigate={scrollToChapter} />

      {/* 4. Left-aligned absolute futuristic status rail details */}
      <div className="absolute left-8 bottom-8 z-30 hidden xl:flex flex-col space-y-2.5 font-mono text-[9px] text-slate-500 max-w-xs pointer-events-none select-none">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="tracking-widest uppercase">COGNITIVE_RESONANCE: OPTIMAL</span>
        </div>
        <p>MATRIX_VOLTAGE: 1.84V • STABLE</p>
        <p>SECTOR_ZOOM: {Math.floor(currentScroll * 100)}% DISPLACEMENT</p>
        <p>© NEUROVERSE AI CORE OS • 2026</p>
      </div>

      {/* 5. Right-aligned active coordinate tags */}
      <div className="absolute right-8 bottom-8 z-30 hidden xl:flex flex-col items-end space-y-1 font-mono text-[9px] text-indigo-400/80 pointer-events-none select-none">
        <p className="flex items-center gap-1"><Orbit className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: "9s" }} /> COORD_GRID: [44.89 // -102.3]</p>
        <p>RECOVERY_SATELLITE: SYNCHRONIZED</p>
      </div>

      {/* 6. Active Scroll Area viewport overlay */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 z-20 overflow-y-auto h-full w-full scroll-smooth custom-scrollbar select-none"
      >
        {/* -------------------------------------------------------------------------- */}
        {/* CHAPTER 1 – AI AWAKENING (LANDING HERO)                                    */}
        {/* -------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center pt-24 pb-12">
          <div className="max-w-4xl relative z-30 flex flex-col items-center select-text">
            {/* Holographic subtitle box */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/30 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Personal AI-Powered Digital Universe</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-black tracking-tight text-white leading-none uppercase">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 shadow-sm animate-pulse">NeuroVerse AI</span>
            </h1>

            <p className="mt-6 text-sm md:text-lg text-[#94a3b8]/80 max-w-2xl font-sans font-medium tracking-wide">
              The first cognitive, scroll-driven visual spatial workspace. Engage with localized synaptic sectors connected direct to the central quantum Core.
            </p>

            {/* Quick interactive stats widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-12 bg-slate-950/40 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/10">
              <div className="text-center font-mono">
                <span className="text-xl md:text-2xl font-extrabold text-cyan-400 block">60 FPS</span>
                <span className="text-[9px] text-[#94a3b8]/40 uppercase tracking-wider block mt-0.5">3D WebGL Fluidity</span>
              </div>
              <div className="text-center font-mono border-l border-white/5">
                <span className="text-xl md:text-2xl font-extrabold text-indigo-400 block">4 CORE</span>
                <span className="text-[9px] text-[#94a3b8]/40 uppercase tracking-wider block mt-0.5">Cognitive Worlds</span>
              </div>
              <div className="text-center font-mono border-l border-white/5">
                <span className="text-xl md:text-2xl font-extrabold text-[#10b981] block">SECURE</span>
                <span className="text-[9px] text-[#94a3b8]/40 uppercase tracking-wider block mt-0.5">Server-Side GenAI</span>
              </div>
              <div className="text-center font-mono border-l border-white/5">
                <span className="text-xl md:text-2xl font-extrabold text-[#f59e0b] block">&lt; 1 sec</span>
                <span className="text-[9px] text-[#94a3b8]/40 uppercase tracking-wider block mt-0.5">Vector Compilation</span>
              </div>
            </div>

            {/* Down Scrolling instructions */}
            <div className="mt-16 flex flex-col items-center space-y-2 opacity-60 animate-bounce">
              <span className="text-[10px] font-mono tracking-widest text-[#94a3b8]/60 uppercase">EXPLORE DIGITAL UNIVERSE</span>
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* CHAPTER 2 – LEARNING ORBIT (SMOOTH TRANSITION)                              */}
        {/* -------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
            {/* Visual description */}
            <div className="lg:col-span-5 space-y-6 select-text text-left">
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400/80 uppercase">
                <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Sector Alpha: Synaptic Knowledge Orbit</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-wider text-white uppercase leading-none">
                Interactive Learning World
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Unlock high-fidelity educational roadmaps generated live by our central processor. Input custom milestones and instantly compile multi-tier training nodes beautifully mapping out complex vectors.
              </p>
              
              <div className="bg-slate-950/60 border border-emerald-500/15 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Autonomous Roadmap Compiler</h4>
                  <p className="text-[11px] text-[#94a3b8]/70 mt-0.5">Calculates sequential chapters for targeted skills across advanced cybernetic sciences.</p>
                </div>
              </div>
            </div>

            {/* Portal Workspace compiler interface */}
            <div className="lg:col-span-7 w-full">
              <AICorePortal sector="roadmap" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* CHAPTER 3 – CAREER VECTOR CITY                                             */}
        {/* -------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
            {/* Portal Portal Interface */}
            <div className="lg:col-span-7 order-2 lg:order-1 w-full">
              <AICorePortal sector="career" />
            </div>

            {/* Visual description text layout */}
            <div className="lg:col-span-5 space-y-6 select-text text-left order-1 lg:order-2">
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-indigo-400/80 uppercase">
                <Briefcase className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Sector Gamma: Cybernetic Career Vectors</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-wider text-white uppercase leading-none">
                Career Vector Grid
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Navigate the shifting jobs criteria of tomorrow. Measure human capability ratios against localized neural skill demands, retrieve critical industry projections, and get custom recommendations.
              </p>

              <div className="bg-slate-950/60 border border-indigo-500/15 p-4 rounded-xl flex items-start gap-3">
                <Cpu className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Analytical Demand Scoring</h4>
                  <p className="text-[11px] text-[#94a3b8]/70 mt-0.5">Dynamically models job readiness percentages mapped over progressive high-contrast bar charts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* CHAPTER 4 – STARTUP ORBITS                                                */}
        {/* -------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24 bg-gradient-to-b from-transparent via-slate-950/10 to-transparent">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
            {/* Visual description */}
            <div className="lg:col-span-5 space-y-6 select-text text-left">
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-amber-400/80 uppercase">
                <Rocket className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Sector Delta: Silicon Venture Orbit</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-wider text-white uppercase leading-none">
                Startup Innovation Hub
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Mobilize startup venture concepts revolving around digital planetary hubs. Query market indices, check financial revenue limits, and structure tactical blueprints with checkboxes to initialize business.
              </p>

              <div className="bg-slate-950/60 border border-amber-500/15 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Market Orbit Visualizers</h4>
                  <p className="text-[11px] text-[#94a3b8]/70 mt-0.5">Analyzes industry TAM calculations with projected annual ARR values in structured metrics.</p>
                </div>
              </div>
            </div>

            {/* Portal compiler interface */}
            <div className="lg:col-span-7 w-full">
              <AICorePortal sector="startup" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* CHAPTER 5 – COMMAND CENTER BACKDOOR COCKPIT                               */}
        {/* -------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24 pb-36">
          <div className="max-w-6xl w-full space-y-12 relative z-20">
            
            {/* Center column introduction */}
            <div className="text-center max-w-3xl mx-auto space-y-4 select-text">
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-cyan-400 uppercase tracking-widest pl-2">
                <Terminal className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "5s" }} />
                <span>Command Center Dashboard Controls</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-wider text-white uppercase leading-none">
                AI Central Command Hub
              </h2>
              <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
                Establish direct interactive contact with the self-aware NeuroVerse Intellect. Re-route structural parameters or coordinate full-scale cosmic calibrations at the click of a key.
              </p>
            </div>

            {/* Horizontal double block: Core Transmission & Operational Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Direct Central Chat */}
              <div className="lg:col-span-8 w-full">
                <AICorePortal sector="general" />
              </div>

              {/* Right Column: System HUD Controls block */}
              <div className="lg:col-span-4 w-full h-full">
                <GlassPanel
                  title="System Integrations"
                  subtitle="SYSTEM ENGINE CRITICAL DIAGS"
                  tag="SYS_INTEG_CTR"
                  accentColor="cyan"
                  className="h-full"
                >
                  <div className="space-y-4 flex flex-col justify-between py-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
                        <span className="text-slate-400">WebGL Acceleration</span>
                        <span className="text-emerald-400 font-bold">ONLINE (60 FPS)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
                        <span className="text-slate-400">Audio Synth Matrix</span>
                        <span className="text-emerald-400 font-bold">READY (44.1kHz)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
                        <span className="text-slate-400">Server API Bridging</span>
                        <span className="text-emerald-400 font-bold">CONNECTED</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      {/* Interactive alert details warning client about simulation limits */}
                      <div className="p-3 bg-indigo-500/10 border border-indigo-400/30 rounded-xl flex items-start gap-2.5">
                        <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-[10.5px] leading-relaxed text-indigo-200">
                          To adjust custom presets or unlock local credentials, explore the <strong>Settings & Secrets</strong> workspace panels securely.
                        </p>
                      </div>

                      <button
                        onClick={handleLaunchSimulation}
                        id="btn_launch_universe"
                        className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-black tracking-widest text-xs uppercase py-3.5 rounded-xl cursor-pointer hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
                      >
                        LAUNCH COGNITIVE CORE
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
