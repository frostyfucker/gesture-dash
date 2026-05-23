import React from 'react';
import { HelpCircle, Star, Sparkles, Smile, ShieldCheck, PlayCircle, Eye } from 'lucide-react';
import { TourStep } from '../types';
import { audioSynth } from './AudioEngine';

interface LegendTourProps {
  currentTourStep: number | null;
  onStartTour: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEndTour: () => void;
  tourSteps: TourStep[];
}

export default function LegendTour({
  currentTourStep,
  onStartTour,
  onNextStep,
  onPrevStep,
  onEndTour,
  tourSteps
}: LegendTourProps) {

  const legendItems = [
    { icon: <Star className="w-4 h-4 text-[#eab308]" />, desc: 'Directs phonetic processing (Phonetic Conductor)' },
    { icon: <Sparkles className="w-4 h-4 text-[#22d3ee] animate-pulse" />, desc: 'Core platform AI Engine' },
    { icon: <Eye className="w-4 h-4 text-pink-400" />, desc: 'Real-time user emotion analysis interface' },
    { icon: <Smile className="w-4 h-4 text-emerald-400" />, desc: 'Overall user cognitive sentiment score' },
    { icon: <ShieldCheck className="w-4 h-4 text-violet-400" />, desc: 'Compliance & strategic database status' },
  ];

  return (
    <div id="legend-tour-section" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl shadow-black/40 flex flex-col justify-between h-[250px] relative transition-all duration-300 hover:border-white/15 group">
      <div className="absolute top-3 right-4 text-[8px] font-mono text-slate-400/60 uppercase">SYS_LEGEND_R2</div>

      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">LEGEND & RUN TOUR</h3>
        </div>
        <div className="text-[8.5px] font-mono text-slate-400">COGNITIVE KEY</div>
      </div>

      {/* Legend list scroll section */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 py-1">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex gap-2.5 items-center bg-white/[0.01] p-1.5 rounded-xl border border-white/5">
            <span className="shrink-0">{item.icon}</span>
            <span className="text-[9px] font-mono text-slate-300 leading-snug">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Start button or step indicators */}
      <div className="mt-2.5 border-t border-white/10 pt-2 flex items-center justify-between gap-1.5 relative z-10">
        {currentTourStep === null ? (
          <button
            onClick={() => {
              audioSynth.init();
              audioSynth.playSonar();
              onStartTour();
            }}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-[9px] py-2 rounded-xl transition-all font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <PlayCircle className="w-4 h-4 animate-pulse text-[#00ffff]" />
            START INTERACTIVE TOUR
          </button>
        ) : (
          <div className="w-full flex items-center justify-between gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
            <div className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Step {currentTourStep + 1} of {tourSteps.length}
            </div>
            
            <div className="flex gap-1.5">
              <button
                onClick={onPrevStep}
                disabled={currentTourStep === 0}
                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[8.5px] font-mono border border-white/10 text-slate-300 disabled:opacity-35 rounded-lg transition-all uppercase cursor-pointer"
              >
                Prev
              </button>
              
              <button
                onClick={onNextStep}
                className="px-2 py-0.5 bg-[#00ffff] hover:scale-105 text-slate-950 text-[8.5px] font-mono font-bold rounded-lg transition-all uppercase cursor-pointer"
              >
                {currentTourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </button>

              <button
                onClick={onEndTour}
                className="px-1.5 py-0.5 border border-red-500/30 hover:bg-red-500/15 text-red-400 text-[8.5px] font-mono rounded-lg cursor-pointer transition-all"
                title="Exit Tour"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
