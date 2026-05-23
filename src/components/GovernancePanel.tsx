import React, { useState } from 'react';
import { Shield, Sparkles, Sliders, CheckSquare, Square } from 'lucide-react';
import { audioSynth } from './AudioEngine';

interface GovernancePanelProps {
  onGovLatencyChange: (lat: number) => void;
}

export default function GovernancePanel({ onGovLatencyChange }: GovernancePanelProps) {
  const [governingMode, setGoverningMode] = useState<number>(1);
  const [capabilities, setCapabilities] = useState([
    { id: 'ca1', name: 'Secure Sandbox Enclave', active: true, latBonus: -1 },
    { id: 'ca2', name: 'Cryptographic Hash Sign', active: true, latBonus: -0.5 },
    { id: 'ca3', name: 'Neural Intent Parser', active: false, latBonus: 2.5 },
    { id: 'ca4', name: 'A-Frame Spacial Grounding', active: true, latBonus: -1.2 },
  ]);

  const handleModeChange = (val: number) => {
    setGoverningMode(val);
    audioSynth.playClick(600 + val * 100, 0.08);
    recalcLatency(val, capabilities);
  };

  const toggleCapability = (id: string) => {
    audioSynth.playClick(500, 0.05);
    const nextCaps = capabilities.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    );
    setCapabilities(nextCaps);
    recalcLatency(governingMode, nextCaps);
  };

  const recalcLatency = (modeIdx: number, capsList: typeof capabilities) => {
    // Basic baseline
    let latencyBase = 4.2;
    // mode impacts
    if (modeIdx === 0) latencyBase = 2.1; // speed focus
    if (modeIdx === 2) latencyBase = 8.5; // rigorous filtering

    // caps impacts
    capsList.forEach(c => {
      if (c.active) {
        latencyBase += c.latBonus;
      }
    });

    const finalLat = Math.max(1, parseFloat(latencyBase.toFixed(1)));
    onGovLatencyChange(finalLat);
  };

  const getSlogan = (idx: number) => {
    if (idx === 0) return "Direct-edge orchestration with minimal node checks.";
    if (idx === 1) return "Deterministic compliance parameters and medium latency verification.";
    return "Ultra-rigorous cryptographic audits across global member spaces.";
  };

  return (
    <div id="governance-node-section" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl shadow-black/40 flex flex-col justify-between h-[250px] relative transition-all duration-300 hover:border-white/15 group">
      <div className="absolute top-3 right-4 text-[8px] font-mono text-slate-400/60">AUDIT_VER_22.9</div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white tracking-widest">1. GLOBAL GOVERNANCE ENFORO</h3>
        </div>
        <div className="text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg bg-emerald-500/5 uppercase">
          GOV STATUS: PASS
        </div>
      </div>

      {/* Strategic Directive Choice */}
      <div className="bg-white/[0.01] p-2.5 text-[10px] rounded-xl border border-white/5">
        <div className="flex justify-between items-center mb-1 text-white select-none">
          <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider">01 • STRATEGIC DIRECTIVE</span>
          <span className="text-[8.5px] font-mono text-slate-400">
            {governingMode === 0 ? "COBALT_LOW_LAT" : governingMode === 1 ? "STEEL_STAND" : "TITAN_RIGOR"}
          </span>
        </div>
        
        {/* Horizontal Slider select */}
        <div className="flex items-center gap-3">
          <Sliders className="w-3.5 h-3.5 text-cyan-300 pointer-events-none" />
          <input 
            type="range" 
            min="0" 
            max="2" 
            value={governingMode} 
            onChange={(e) => handleModeChange(parseInt(e.target.value))}
            className="flex-1 accent-cyan-400 bg-white/10 rounded-full h-1 cursor-pointer"
          />
        </div>
        <div className="text-[8.5px] text-slate-300 font-mono mt-1 pt-0.5 italic truncate">
          {getSlogan(governingMode)}
        </div>
      </div>

      {/* Capability filtering checklist */}
      <div className="flex flex-col gap-1%">
        <span className="font-mono text-cyan-400 font-bold text-[9.5px] uppercase tracking-wider mb-1 block">02 • CAPABILITY FILTERING</span>
        <div className="grid grid-cols-2 gap-1.5">
          {capabilities.map(cap => (
            <button
              key={cap.id}
              onClick={() => toggleCapability(cap.id)}
              className={`flex items-center gap-1.5 p-1.5 rounded-xl text-left border transition-all text-[8.5px] font-mono cursor-pointer ${
                cap.active 
                  ? 'bg-cyan-400/20 border-cyan-400 text-white' 
                  : 'bg-white/[0.01] border-white/5 text-slate-400/70 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              {cap.active ? <CheckSquare className="w-3 h-3 text-cyan-400 shrink-0" /> : <Square className="w-3 h-3 shrink-0" />}
              <span className="truncate">{cap.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
