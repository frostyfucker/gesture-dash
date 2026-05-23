import React, { useState } from 'react';
import { Target, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { audioSynth } from './AudioEngine';

export default function MarketIntelligence() {
  const [activeTab, setActiveTab] = useState<'SWOT' | 'COMPETITIVE'>('SWOT');

  const swotMatrix = {
    strengths: [
      'Governance-first logic',
      'Deterministic AZA flow',
      'Low-latency node processing',
      'A-Frame 3D Spatial calibration capability'
    ],
    weaknesses: [
      'Combining SWOT & Matrix interfaces directly',
      'Highly futuristic newer Library API requirements',
      'Continuous telemetry resource heavy execution (simulated)'
    ]
  };

  const competitiveList = [
    { tool: 'VaporNodes Core', govStatus: 'High', latency: '2.5ms', status: 'Optimal' },
    { tool: 'CressAI Node', govStatus: 'Moderate', latency: '8.1ms', status: 'Review' },
    { tool: 'Aetheris AI Matrix', govStatus: 'Low', latency: '15.2ms', status: 'Warning' },
    { tool: 'Omnic Mesh Pro', govStatus: 'High', latency: '3.0ms', status: 'Optimal' }
  ];

  const handleTabChange = (tab: 'SWOT' | 'COMPETITIVE') => {
    setActiveTab(tab);
    audioSynth.playClick(650, 0.05);
  };

  return (
    <div id="market-intel-section" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl shadow-black/40 flex flex-col justify-between h-[250px] relative transition-all duration-300 hover:border-white/15 group">
      <div className="absolute top-3 right-4 text-[8px] font-mono text-slate-400/60">MARKET_MAPPED_V1</div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white tracking-widest">3. MARKET INTELLIGENCE</h3>
        </div>

        {/* Futuristic Tab selectors */}
        <div className="flex border border-white/10 rounded-xl overflow-hidden bg-white/5 p-0.5">
          <button
            onClick={() => handleTabChange('SWOT')}
            className={`px-3 py-1 text-[9px] font-mono transition-all rounded-lg cursor-pointer font-semibold ${
              activeTab === 'SWOT' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            SWOT
          </button>
          <button
            onClick={() => handleTabChange('COMPETITIVE')}
            className={`px-3 py-1 text-[9px] font-mono transition-all rounded-lg cursor-pointer font-semibold ${
              activeTab === 'COMPETITIVE' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            COMPETITIVE
          </button>
        </div>
      </div>

      {/* Tab contents */}
      <div className="flex-1 min-h-0 bg-white/[0.01] rounded-2xl border border-white/5 p-3 overflow-y-auto custom-scrollbar">
        {activeTab === 'SWOT' ? (
          <div className="grid grid-cols-2 gap-3 h-full">
            {/* Strengths column */}
            <div className="flex flex-col gap-1 pr-1.5 border-r border-white/10">
              <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5 shrink-0" /> Strengths
              </span>
              <ul className="list-disc list-inside text-[8.5px] text-slate-300 font-mono space-y-1 mt-0.5 leading-normal">
                {swotMatrix.strengths.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="truncate" title={s}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses column */}
            <div className="flex flex-col gap-1 pl-1.5">
              <span className="text-[8px] font-mono font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-0.5">
                <ShieldAlert className="w-2.5 h-2.5 shrink-0" /> Weaknesses
              </span>
              <ul className="list-disc list-inside text-[8.5px] text-slate-300 font-mono space-y-1 mt-0.5 leading-normal">
                {swotMatrix.weaknesses.slice(0, 3).map((w, idx) => (
                  <li key={idx} className="truncate" title={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[8.5px] font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-1 uppercase">TOOL MATRIX</th>
                <th className="py-1 uppercase">GOV STATUS</th>
                <th className="py-1 uppercase">LATENCY</th>
                <th className="py-1 text-right uppercase">METRIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white select-none">
              {competitiveList.map((c, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-1.5 font-bold">{c.tool}</td>
                  <td className={c.govStatus === 'High' ? 'text-emerald-400 py-1.5' : 'text-yellow-400 py-1.5'}>{c.govStatus}</td>
                  <td className="py-1.5 text-cyan-300">{c.latency}</td>
                  <td className={`py-1.5 text-right font-bold ${c.status === 'Optimal' ? 'text-emerald-400' : c.status === 'Warning' ? 'text-red-400' : 'text-yellow-400'}`}>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-2 text-[8px] font-mono text-slate-400/60 flex gap-2 justify-between uppercase">
        <span className="flex items-center gap-1">
          <Award className="w-3 h-3 text-cyan-400" /> VAPORNODES BRAND CONGRUENCE IS DETECTED [OPTIMAL]
        </span>
      </div>
    </div>
  );
}
