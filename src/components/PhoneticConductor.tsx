import React, { useState, useRef, useEffect } from 'react';
import { audioSynth } from './AudioEngine';
import { Play, RotateCcw, Volume2, MoveHorizontal, Disc, VolumeX, Sparkles } from 'lucide-react';

interface PhonemeNode {
  id: string;
  symbol: string;
  ipa: string;
  pitch: number;
}

export default function PhoneticConductor() {
  const [phonemes, setPhonemes] = useState<PhonemeNode[]>([
    { id: '1', symbol: 'ɔː', ipa: '/ɔː/', pitch: 220 },
    { id: '2', symbol: 'r', ipa: '/r/', pitch: 240 },
    { id: '3', symbol: 'k', ipa: '/k/', pitch: 280 },
    { id: '4', symbol: 'ɛ', ipa: '/ɛ/', pitch: 300 },
    { id: '5', symbol: 's', ipa: '/s/', pitch: 340 },
    { id: '6', symbol: 't', ipa: '/t/', pitch: 380 },
    { id: '7', symbol: 'eɪ', ipa: '/eɪ/', pitch: 440 },
    { id: '8', symbol: 't', ipa: '/t/', pitch: 480 },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activePhonemeIndex, setActivePhonemeIndex] = useState<number | null>(null);
  const [isConducting, setIsConducting] = useState(false);
  const [batonPos, setBatonPos] = useState({ x: 120, y: 150 });
  const [batonSpeed, setBatonSpeed] = useState(0);
  const [muteHum, setMuteHum] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playTimeoutRef = useRef<number | null>(null);
  const dragItemIdx = useRef<number | null>(null);

  useEffect(() => {
    // Canvas animation for the Conductor wave and stardust trails
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw interactive conductor wave background
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        const offset = Math.sin(Date.now() * 0.002 + i * 0.01) * 30 * (batonSpeed + 0.2);
        ctx.moveTo(0, i);
        ctx.bezierCurveTo(canvas.width * 0.3, i + offset, canvas.width * 0.7, i - offset, canvas.width, i);
        ctx.stroke();
      }

      // Draw the static futuristic Conductor Baton Hand matching picture visual
      drawHandBaton(ctx);

      // Particle update and draw
      if (isConducting) {
        // Emit particles
        for (let j = 0; j < 3; j++) {
          particles.push({
            x: batonPos.x,
            y: batonPos.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            alpha: 1.0,
            size: Math.random() * 3 + 2,
          });
        }
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#22d3ee';
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw tracking line from cursor
      if (isConducting) {
        ctx.save();
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(batonPos.x, batonPos.y, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const drawHandBaton = (ctx: CanvasRenderingContext2D) => {
      // Background conduit grid
      ctx.save();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.lineWidth = 1.5;
      
      // Conductor hand silhouette stylized
      ctx.beginPath();
      ctx.arc(60, 160, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(11, 16, 21, 0.8)';
      ctx.fill();
      ctx.stroke();

      // Golden electric conductor wand line going to current batonPos
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#eab308'; // Glowing gold
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#eab308';
      ctx.beginPath();
      ctx.moveTo(50, 165); // base hand
      // Interpolate towards batonPos with a rigid wand feeling
      ctx.lineTo(batonPos.x, batonPos.y);
      ctx.stroke();

      // Wand bright white neon tip
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(batonPos.x, batonPos.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [batonPos, isConducting, batonSpeed]);

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    audioSynth.init();
    setIsConducting(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isConducting) return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    // Calculate speed of dragging
    const dx = x - batonPos.x;
    const dy = y - batonPos.y;
    const distance = Math.hypot(dx, dy);
    setBatonSpeed(Math.min(2.5, distance / 10));

    // Synthesis effect based on wave altitude (y changes pitch, x changes filter)
    if (distance > 3) {
      const computedPitch = 150 + (300 - y) * 1.5;
      const index = Math.floor((x / container.width) * phonemes.length);
      const targetIdx = Math.max(0, Math.min(phonemes.length - 1, index));

      if (targetIdx !== activePhonemeIndex) {
        setActivePhonemeIndex(targetIdx);
        const phonemeVal = phonemes[targetIdx];
        audioSynth.playPhoneme(computedPitch, phonemeVal.symbol as any);
      }
    }

    setBatonPos({ x, y });
  };

  const handlePointerUp = () => {
    setIsConducting(false);
    setActivePhonemeIndex(null);
    setBatonSpeed(0);
  };

  // Play phoneme queue one-by-one
  const runAutoPlayback = (index: number = 0) => {
    if (index >= phonemes.length) {
      setIsPlaying(false);
      setActivePhonemeIndex(null);
      return;
    }
    setIsPlaying(true);
    setActivePhonemeIndex(index);
    const phoneme = phonemes[index];
    
    // Play synthesis
    audioSynth.playPhoneme(phoneme.pitch, phoneme.symbol as any);

    playTimeoutRef.current = window.setTimeout(() => {
      runAutoPlayback(index + 1);
    }, 280);
  };

  const triggerPlay = () => {
    audioSynth.init();
    if (isPlaying) {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      setIsPlaying(false);
      setActivePhonemeIndex(null);
    } else {
      runAutoPlayback(0);
    }
  };

  // Drag and drop sorting logic
  const onDragStart = (idx: number) => {
    dragItemIdx.current = idx;
    audioSynth.playClick(440, 0.05);
  };

  const onDragEnter = (idx: number) => {
    if (dragItemIdx.current === null || dragItemIdx.current === idx) return;
    const nextPhonemes = [...phonemes];
    const item = nextPhonemes.splice(dragItemIdx.current, 1)[0];
    nextPhonemes.splice(idx, 0, item);
    dragItemIdx.current = idx;
    setPhonemes(nextPhonemes);
    audioSynth.playClick(350, 0.03);
  };

  const onDragEnd = () => {
    dragItemIdx.current = null;
    audioSynth.playClick(600, 0.08);
  };

  const toggleHum = () => {
    const nextMute = !muteHum;
    setMuteHum(nextMute);
    audioSynth.init();
    audioSynth.setAmbientVolume(nextMute ? 0 : 1);
  };

  return (
    <div id="phonetic-conductor-module" className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/10 p-5 shadow-2xl shadow-black/40 flex flex-col relative h-[380px] select-none group transition-all duration-300 hover:border-white/15">
      {/* Module Title A */}
      <div className="absolute top-4 left-4 bg-white/5 text-slate-300 border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
        MODULE A
      </div>
      
      <div className="flex justify-between items-start mb-1 mt-3 pl-1">
        <div>
          <h2 className="text-white text-base font-bold font-mono tracking-wide">PHONETIC CONDUCTOR MODULE</h2>
          <p className="text-[#22d3ee]/60 text-[10px] uppercase font-mono tracking-wider">Interactive Programmatic Articulation</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleHum} 
            className={`p-1.5 rounded-lg border transition-all ${muteHum ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}
            title="Toggle Hologram Console Hum"
          >
            {muteHum ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Canvas containing electrical conducting gesture tracks */}
      <div 
        className="flex-1 min-h-0 bg-white/[0.02] rounded-2xl border border-white/5 relative overflow-hidden my-3 cursor-pointer transition-all hover:bg-white/[0.03]"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pb-1" width={400} height={180} />
        
        {/* Floating guide annotation */}
        <div className="absolute top-2 right-2 p-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl text-right pointer-events-none shadow-lg">
          <p className="text-[#38bdf8] text-[8.5px] font-mono uppercase tracking-wider">Holographic Conductor</p>
          <p className="text-white text-[9.5px] font-sans">Grab tip & drag to synthesise sounds</p>
          <p className="text-[#eab308] text-[8.5px] font-mono mt-0.5">BATON RAD: {(batonSpeed * 10).toFixed(0)} MHz</p>
        </div>

        {/* Real image asset flag matching mockup */}
        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[8.5px] font-mono border border-white/10 px-2 py-0.5 rounded-lg tracking-wider flex items-center gap-1">
          <img src="/api/placeholder/10/10" alt="real-time" className="hidden" />
          <Disc className="w-3 h-3 text-cyan-400 animate-spin" />
          REAL-TIME GRAPHIC BUS
        </div>

        {isConducting && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
            <div className="bg-cyan-500/10 border border-cyan-400/20 text-[#00f2fe] text-[8px] font-mono py-0.5 px-2.5 rounded-full animate-pulse uppercase tracking-wider">
              PROJECTION ENGAGED • SYNTH OUT
            </div>
          </div>
        )}
      </div>

      {/* Interactive Phonetic Draggable blocks `/ɔːrkɛstr'eɪt/` */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300/80">
          <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
            <MoveHorizontal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Drag Blocks to Mutate Phonetics
          </span>
          <span className="text-[10px] text-amber-400 font-bold tracking-wider">IPA: {phonemes.map(p => p.symbol).join('')}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {phonemes.map((ph, idx) => (
            <div
              key={ph.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnter={() => onDragEnter(idx)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => {
                audioSynth.init();
                audioSynth.playPhoneme(ph.pitch, ph.symbol as any);
              }}
              className={`flex-1 min-w-[32px] h-10 rounded-xl border text-center flex flex-col justify-center cursor-grab active:cursor-grabbing transition-all ${
                activePhonemeIndex === idx
                  ? 'bg-cyan-400/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-cyan-400/50 hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-xs font-bold leading-tight uppercase font-sans">{ph.symbol}</div>
              <div className="text-[7.5px] text-slate-400 font-mono scale-90">{ph.ipa}</div>
            </div>
          ))}

          {/* Core synthesis playback trigger button */}
          <button
            onClick={triggerPlay}
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
              isPlaying
                ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:scale-105'
                : 'bg-white/10 border border-white/15 text-white hover:bg-white/20 hover:scale-105'
            }`}
            title="Synthesize Sequence Voice"
          >
            {isPlaying ? <RotateCcw className="w-4 h-4 animate-spin text-red-400" /> : <Play className="w-4 h-4 fill-current text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
