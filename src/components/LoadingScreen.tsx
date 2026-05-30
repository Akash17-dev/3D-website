import { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Terminal, Shield, Zap, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLog, setCurrentLog] = useState("Calibrating quantum core oscillators...");
  const [logHistory, setLogHistory] = useState<string[]>([]);

  const sysLogs = [
    "Spinning up decentralized mind-mesh node arrays...",
    "Injecting holographic vector metrics...",
    "Reconstructing spatial 3D wireframe universes...",
    "Calibrating high-density light pillars in Chapter 3...",
    "Synchronizing autonomous learning roadmaps in Sector Beta...",
    "Establishing high-speed client-server link streams...",
    "AI CORE Core-Link successfully established.",
    "System status: 100% synchronized."
  ];

  useEffect(() => {
    // Generate simulated high-tech loading logs
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < sysLogs.length) {
        const nextLog = sysLogs[logIndex];
        setCurrentLog(nextLog);
        setLogHistory(prev => [...prev, nextLog].slice(-5));
        logIndex++;
      }
    }, 450);

    // Incremental progress loading bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoaded(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + step);
      });
    }, 180);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleEnter = () => {
    // Unmute sounds and start background synth hums!
    soundEngine.setMute(false);
    soundEngine.playSweep();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden font-mono text-cyan-400 select-none">
      {/* Background Matrix-like glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)]" />
      
      {/* HUD borders */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-cyan-500/40" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-cyan-500/40" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-cyan-500/40" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-cyan-500/40" />

      {/* Futuristic central dial */}
      <div className="relative flex flex-col items-center p-8 max-w-xl w-full text-center">
        <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 border-b-emerald-400 animate-spin" style={{ animationDuration: "1.5s", direction: "reverse" }} />
        </div>
        
        {/* Absolute inner text progress indicator */}
        <div className="absolute top-[68px] text-2xl font-bold tracking-widest text-cyan-200">
          {progress}%
        </div>

        <h1 className="mt-8 text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent font-sans">
          NEUROVERSE AI
        </h1>
        <p className="text-xs text-cyan-500/60 uppercase tracking-widest mt-1">
          Cognitive 3D Operating System v4.5.1
        </p>

        {/* Diagnostic Logs Panel */}
        <div className="mt-10 w-full bg-slate-950/80 border border-cyan-500/30 p-4 rounded-xl text-left text-[11px] leading-relaxed block h-40 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] relative backdrop-blur-md">
          <div className="absolute top-2 right-3 flex items-center space-x-1.5 text-[9px] text-cyan-500/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LINK-SECURE</span>
          </div>
          <p className="text-emerald-400 flex items-center mb-1.5 font-bold uppercase tracking-wide">
            <Terminal className="w-3.5 h-3.5 mr-1" /> CORE DIAGNOSTICS & SYNC ENGINE
          </p>
          <div className="space-y-1 opacity-70">
            {logHistory.map((log, i) => (
              <p key={i} className="truncate">
                &gt; {log}
              </p>
            ))}
          </div>
          <p className="mt-2 text-cyan-300 font-bold animate-pulse truncate">
            &gt;&gt; {currentLog}
          </p>
        </div>

        {/* Loader status */}
        {!isLoaded ? (
          <div className="mt-8 w-full">
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-cyan-950">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 shadow-[0_0_8px_#06b6d4]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-cyan-500/40 uppercase tracking-widest mt-2 animate-pulse">
              Synchronizing vector pipelines...
            </p>
          </div>
        ) : (
          <button
            onClick={handleEnter}
            id="btn_enter_neuroverse"
            className="mt-8 px-8 py-3.5 rounded-xl border border-emerald-400 font-sans font-bold tracking-widest bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-300 hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-white hover:border-emerald-300 hover:scale-[1.05] shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transition-all duration-300 flex items-center justify-center space-x-2 animate-bounce cursor-pointer"
          >
            <Shield className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            <span>ENGAGE COGNITIVE BRIDGE</span>
          </button>
        )}
      </div>

      {/* Decorative Cybernetic Specs and Credits */}
      <div className="absolute bottom-6 flex items-center space-x-6 text-[10px] text-slate-500/80">
        <span className="flex items-center"><Zap className="w-3 h-3 mr-1 text-cyan-500" /> SECURE OAUTH VERIFIED</span>
        <span>•</span>
        <span className="flex items-center"><Sparkles className="w-3 h-3 mr-1 text-cyan-500" /> QUANTUM COMPENSATOR RECOVERY: ON</span>
      </div>
    </div>
  );
}
