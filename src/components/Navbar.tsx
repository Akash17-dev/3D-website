import { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Volume2, VolumeX, Radio, Cpu, Network, Briefcase, Rocket, Terminal } from "lucide-react";

interface NavbarProps {
  activeChapter: number;
  onNavigate: (index: number) => void;
}

export default function Navbar({ activeChapter, onNavigate }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Sync React state with Sound Engine's initial state
    setIsMuted(soundEngine.isMuted());
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    soundEngine.setMute(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  const handleNavClick = (index: number) => {
    soundEngine.playClick();
    onNavigate(index);
  };

  const navItems = [
    { label: "Core Awakening", icon: Cpu },
    { label: "Learning Orbit", icon: Network },
    { label: "Career Vector", icon: Briefcase },
    { label: "Venture Planet", icon: Rocket },
    { label: "Command Hub", icon: Terminal }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-black/30 backdrop-blur-md border-b border-cyan-500/10 font-sans select-none px-6 md:px-12 py-4 flex items-center justify-between">
      {/* Dynamic scan line effect across banner */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Brand Logo & Core state */}
      <div 
        onClick={() => handleNavClick(0)}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] group-hover:scale-[1.05] transition-all duration-300">
          <span className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-black text-sm tracking-widest text-white group-hover:text-cyan-300 transition-colors">
              NEUROVERSE
            </span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-400/30">
              AI_OS
            </span>
          </div>
          <p className="text-[8px] font-mono tracking-widest text-[#94a3b8]/60 uppercase">
            Quantal Grid Active
          </p>
        </div>
      </div>

      {/* Cinematic Chapter Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 border border-cyan-500/10 rounded-full p-1 max-w-xl">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeChapter === index + 1; // chapters are 1-based, index is 0-based
          return (
            <button
              key={index}
              onClick={() => handleNavClick(index + 1)}
              className={`px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400 animate-pulse" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sound System Controls & Network Stream indicators */}
      <div className="flex items-center space-x-4">
        {/* Synthetic sound wave visualization bars */}
        {!isMuted && (
          <div className="flex items-end space-x-0.5 h-3 w-5 opacity-70">
            <div className="w-0.5 bg-cyan-400 animate-[bounce_0.8s_infinite] h-full" />
            <div className="w-0.5 bg-cyan-300 animate-[bounce_0.6s_infinite_0.1s] h-4/5" />
            <div className="w-0.5 bg-indigo-400 animate-[bounce_0.9s_infinite_0.2s] h-[120%]" />
            <div className="w-0.5 bg-blue-300 animate-[bounce_0.5s_infinite_0.3s] h-1/2" />
          </div>
        )}

        {/* Audio Active Toggle button */}
        <button
          onClick={toggleSound}
          id="btn_toggle_mute"
          className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
            !isMuted
              ? "bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:border-cyan-400"
              : "bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
          }`}
          title={isMuted ? "Power up acoustic environment synth" : "Mute environmental audio oscillators"}
        >
          {!isMuted ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Satellite Sync node display */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-950/80 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-mono leading-none">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-[pulse_1.2s_infinite]" />
          <div className="text-left">
            <p className="text-cyan-400 uppercase tracking-wide font-bold">NODE: ONLINE</p>
            <p className="text-[8px] text-[#94a3b8]/40 -mt-0.5">LATENCY: 5ms</p>
          </div>
        </div>
      </div>
    </header>
  );
}
