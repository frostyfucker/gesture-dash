import React, { useRef, useState, useEffect } from 'react';
import { audioSynth } from './AudioEngine';
import { Sparkles, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';

interface GesturePadProps {
  onGestureRecognized: (gesture: string) => void;
}

export default function GesturePad({ onGestureRecognized }: GesturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [recognized, setRecognized] = useState<string | null>(null);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    audioSynth.playClick(600, 0.05);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
    setRecognized(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    // Draw lines with Neon Glow
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines for futuristic console look
    drawConsoleGrid(ctx, rect.width, rect.height);

    ctx.strokeStyle = '#22d3ee'; // Cyan glow
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22d3ee';

    ctx.beginPath();
    ctx.moveTo(newPoints[0].x, newPoints[0].y);
    for (let i = 1; i < newPoints.length; i++) {
      ctx.lineTo(newPoints[i].x, newPoints[i].y);
    }
    ctx.stroke();
  };

  const drawConsoleGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (points.length < 5) return;

    // Detect gestures algorithmically
    const gesture = recognizeGesture(points);
    if (gesture) {
      setRecognized(gesture);
      audioSynth.playGestureSuccess(gesture);
      onGestureRecognized(gesture);
      setGestureHistory((prev) => [gesture, ...prev].slice(0, 5));
    } else {
      setRecognized("Unknown Node Gesture");
      audioSynth.playClick(200, 0.15, 'sawtooth');
    }

    // Clear canvas shortly
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConsoleGrid(ctx, rect.width, rect.height);
    }, 1000);
  };

  const recognizeGesture = (pts: { x: number; y: number }[]): string | null => {
    // 1. Calculate bounding box & lengths
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const width = maxX - minX;
    const height = maxY - minY;
    
    if (width < 10 && height < 10) return "Tap";

    const lastPt = pts[pts.length - 1];
    const firstPt = pts[0];
    const dx = lastPt.x - firstPt.x;
    const dy = lastPt.y - firstPt.y;

    // Check for circle (first and last points close, but path goes wide)
    const distStartEnd = Math.hypot(dx, dy);
    const perimeter = pts.reduce((sum, p, i) => i === 0 ? 0 : sum + Math.hypot(p.x - pts[i-1].x, p.y - pts[i-1].y), 0);
    
    if (distStartEnd < width * 0.4 && perimeter > width * 2.5) {
      return "Circle";
    }

    // Check for Swipes
    if (width > 40 && height < 30) {
      return dx > 0 ? "Swipe Right" : "Swipe Left";
    }
    if (height > 40 && width < 30) {
      return dy > 0 ? "Swipe Down" : "Swipe Up";
    }

    // Check for checkmark (down-right then up-right)
    // Find absolute minimum Y point (should be close to start or middle)
    let minPtIndex = 0;
    let maxPtY = -Infinity;
    pts.forEach((p, idx) => {
      if (p.y > maxPtY) {
        maxPtY = p.y;
        minPtIndex = idx;
      }
    });

    if (minPtIndex > pts.length * 0.2 && minPtIndex < pts.length * 0.8 && dy < -10) {
      return "Checkmark";
    }

    return null;
  };

  const clearHistory = () => {
    setGestureHistory([]);
    audioSynth.playClick(400, 0.08);
  };

  return (
    <div id="gesture-controller" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl shadow-black/40 relative overflow-hidden flex flex-col h-[280px] transition-all duration-300 hover:border-white/15 group">
      <div className="absolute top-3 right-4 text-[8px] font-mono text-slate-400/60 tracking-wider font-semibold uppercase">GESTURE_BUS_V1.0</div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#22d3ee] animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white tracking-wider">HOLOGRAPHIC GESTURE ADAPTER</h3>
        </div>
        {gestureHistory.length > 0 && (
          <button onClick={clearHistory} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer" title="Clear tracking logs">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-1 min-h-0">
        {/* Interactive Canvas Trackpad */}
        <div className="flex-1 relative bg-white/[0.01] rounded-2xl overflow-hidden border border-white/5 group transition-all hover:bg-white/[0.02]">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3 select-none">
            {recognized ? (
              <div className="animate-bounce">
                <p className="text-[#00ffff] font-mono text-[10px] uppercase tracking-wider">Gesture Decoded</p>
                <p className="text-xl font-bold text-white font-mono">{recognized}</p>
              </div>
            ) : (
              <p className="text-slate-400/50 text-[9.5px] font-mono uppercase tracking-widest px-4 leading-relaxed group-hover:text-slate-300/80 transition-colors">
                Draw here:<br/>
                <span className="text-cyan-400 font-semibold">◯ Circle</span> (Toggle 3D Arc)<br/>
                <span className="text-cyan-400 font-semibold">✓ Checkmark</span> (Speedup docs)<br/>
                <span className="text-cyan-400 font-semibold">↑ Swipe Up</span> (Next Step)
              </p>
            )}
          </div>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair pb-1"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Console Readout */}
        <div className="w-[110px] bg-white/[0.02] p-3 rounded-2xl border border-white/5 flex flex-col gap-1.5 justify-between">
          <div>
            <div className="text-[8px] font-mono font-bold text-slate-400 border-b border-white/10 pb-1 mb-1 tracking-wider uppercase">INPUT STACK</div>
            <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto custom-scrollbar">
              {gestureHistory.length === 0 ? (
                <div className="text-[8px] font-mono text-slate-400/30 italic mt-6 text-center uppercase tracking-wider">Awaiting...</div>
              ) : (
                gestureHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[8.5px] font-mono text-slate-300 py-0.5 animate-fade-in uppercase">
                    <ShieldCheck className="w-2.5 h-2.5 text-cyan-400 shrink-0 animate-pulse" />
                    <span className="truncate">{h}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-1.5">
            <div className="flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 text-slate-400 animate-spin animate-duration-3000" />
              <div className="text-[7.5px] font-mono text-slate-400 tracking-wider uppercase">G_RECOGNIZER</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
