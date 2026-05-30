import React from "react";
import { soundEngine } from "./SoundEngine";
import { Maximize2, ShieldCheck } from "lucide-react";

interface GlassPanelProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  tag?: string;
  className?: string;
  accentColor?: 'cyan' | 'emerald' | 'indigo' | 'amber';
  key?: React.Key;
}

export default function GlassPanel({
  children,
  title,
  subtitle,
  tag = "SYS_SEC_A",
  className = "",
  accentColor = 'cyan'
}: GlassPanelProps) {
  
  const accentScheme = {
    cyan: {
      border: "border-cyan-500/25 group-hover:border-cyan-400/40",
      glow: "shadow-[rgba(6,182,212,0.05)_0px_0px_30px]",
      text: "text-cyan-400",
      bg: "bg-cyan-500/5",
      corner: "border-cyan-400"
    },
    emerald: {
      border: "border-emerald-500/25 group-hover:border-emerald-400/40",
      glow: "shadow-[rgba(16,185,129,0.05)_0px_0px_30px]",
      text: "text-emerald-400",
      bg: "bg-emerald-500/5",
      corner: "border-emerald-400"
    },
    indigo: {
      border: "border-indigo-500/25 group-hover:border-indigo-400/40",
      glow: "shadow-[rgba(99,102,241,0.05)_0px_0px_30px]",
      text: "text-indigo-400",
      bg: "bg-indigo-300/5",
      corner: "border-indigo-400"
    },
    amber: {
      border: "border-amber-500/25 group-hover:border-amber-400/40",
      glow: "shadow-[rgba(245,158,11,0.05)_0px_0px_30px]",
      text: "text-amber-400",
      bg: "bg-amber-300/5",
      corner: "border-amber-400"
    }
  };

  const currentAccent = accentScheme[accentColor];

  const handlePanelHover = () => {
    soundEngine.playTick();
  };

  return (
    <div 
      onMouseEnter={handlePanelHover}
      className={`group relative backdrop-blur-lg bg-slate-950/50 border rounded-2xl p-6 transition-all duration-300 ${currentAccent.border} ${currentAccent.glow} ${className}`}
    >
      {/* HUD Diagonal corners / Cybernetic Details */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${currentAccent.corner}/60 rounded-tl-xl`} />
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${currentAccent.corner}/60 rounded-tr-xl`} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${currentAccent.corner}/60 rounded-bl-xl`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${currentAccent.corner}/60 rounded-br-xl`} />

      {/* Futuristic Scan Line overlay effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffffff0a] to-transparent animate-pulse" />

      {/* Diagnostic Side Bar Badge detailing sector mapping */}
      <div className="absolute top-2.5 right-3 flex items-center space-x-1.5 font-mono text-[8px] text-[#94a3b8]/40 leading-none">
        <span className="truncate">{tag}</span>
        <ShieldCheck className="w-2.5 h-2.5 text-[#e2e8f0]/20 group-hover:text-cyan-400/50 transition-colors" />
      </div>

      {/* Header section */}
      {(title || subtitle) && (
        <div className="mb-4 border-b border-white/5 pb-3">
          {title && (
            <h3 className="text-base font-black tracking-wider text-white uppercase flex items-center">
              <span className={`w-1 h-3.5 mr-2 rounded ${currentAccent.bg}`} />
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] font-mono tracking-widest text-[#94a3b8]/60 mt-0.5 uppercase">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Body */}
      <div className="text-sm text-slate-300/90 leading-relaxed font-sans mt-1">
        {children}
      </div>

      {/* Decorative low-key footer indicators */}
      <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500 group-hover:text-slate-400/70 transition-colors">
        <span className="tracking-widest truncate uppercase">COGNITIVE_GRID_CALIB</span>
        <span className="flex items-center space-x-1 uppercase">
          <Maximize2 className="w-2 h-2 mr-1" /> ACTIVE
        </span>
      </div>
    </div>
  );
}
