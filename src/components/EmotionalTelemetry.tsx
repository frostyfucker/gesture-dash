import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Eye, ShieldCheck, Check } from 'lucide-react';
import { audioSynth } from './AudioEngine';

export default function EmotionalTelemetry() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState(72); // out of 100
  const [attention, setAttention] = useState(88);
  const [confidence, setConfidence] = useState(92);
  const [stress, setStress] = useState(15);
  const [anomalyCount, setAnomalyCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  // Request camera access
  const startCamera = async () => {
    audioSynth.playClick(800, 0.1);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 }
      });
      setStream(mediaStream);
      setHasCamera(true);
      setErrorMsg(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera Access Denied or Unavailable:", err);
      setErrorMsg("Camera denied. Reverting code to synthetic telemetry mesh.");
      setHasCamera(false);
    }
  };

  // Rendering Loop for facial tracker matrix overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepY = 0;
    let sweepDir = 1;
    let meshOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hasCamera && videoRef.current && videoRef.current.readyState === 4) {
        // Draw real camera stream
        ctx.save();
        ctx.globalAlpha = 0.5; // Holographic style opacity
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Apply dark cyber filter overlay
        ctx.fillStyle = 'rgba(11, 16, 21, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Draw synthetic wireframe face vector when no webcam
        drawSyntheticFace(ctx, canvas.width, canvas.height, meshOffset);
      }

      // Draw the cyber tracking grid dots & lines overlay
      drawCyberGridOverlay(ctx, canvas.width, canvas.height, sweepY);

      // Random jitter states logic
      if (Math.random() < 0.05) {
        setSentiment(prev => Math.max(10, Math.min(100, prev + (Math.random() - 0.5) * 8)));
        setAttention(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 6)));
        setConfidence(prev => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 5)));
        setStress(prev => Math.max(0, Math.min(50, prev + (Math.random() - 0.5) * 10)));
        if (Math.random() < 0.05) {
          setAnomalyCount(prev => prev + 1);
          audioSynth.playClick(200, 0.2, 'triangle');
        }
      }

      // Sweep scanning line
      sweepY += 1.8 * sweepDir;
      if (sweepY > canvas.height || sweepY < 0) {
        sweepDir *= -1;
      }
      meshOffset += 0.05;

      animId = requestAnimationFrame(render);
    };

    const drawSyntheticFace = (ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) => {
      const cx = w / 2;
      const cy = h / 2 - 10;
      const scaleX = 45;
      const scaleY = 55;

      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
      ctx.lineWidth = 1;

      // Draw oval head grid lines
      for (let r = 0.3; r <= 1.2; r += 0.15) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, scaleX * r, scaleY * r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw meridian lines going to the center
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * scaleX * 1.2, cy + Math.sin(angle) * scaleY * 1.2);
        ctx.stroke();
      }

      // Drawing cyberpunk node mesh points for face contour
      const facePoints = [
        // Eyes
        { x: cx - 22, y: cy - 12, label: 'E_LT_OUT' },
        { x: cx + 22, y: cy - 12, label: 'E_RT_OUT' },
        { x: cx - 8, y: cy - 12, label: 'E_LT_IN' },
        { x: cx + 8, y: cy - 12, label: 'E_RT_IN' },
        // Nose
        { x: cx, y: cy - 4, label: 'N_BRIDGE' },
        { x: cx, y: cy + 12, label: 'N_BASE' },
        // Mouth
        { x: cx - 18, y: cy + 24, label: 'M_LT_LIP' },
        { x: cx + 18, y: cy + 24, label: 'M_RT_LIP' },
        { x: cx, y: cy + 20, label: 'M_UP_LIP' },
        { x: cx, y: cy + 28, label: 'M_DN_LIP' },
        // Chin & Cheeks
        { x: cx, y: cy + 42, label: 'CHIN_STR' },
        { x: cx - 38, y: cy + 10, label: 'CH_LT' },
        { x: cx + 38, y: cy + 10, label: 'CH_RT' },
      ];

      // Connect mouth nodes for outline
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy + 24);
      ctx.quadraticCurveTo(cx, cy + 20 + Math.sin(offset) * 2, cx + 18, cy + 24);
      ctx.quadraticCurveTo(cx, cy + 28 - Math.sin(offset) * 2, cx - 18, cy + 24);
      ctx.stroke();

      // Draw eyes contour
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - 12, 6, 4 + Math.abs(Math.sin(offset)) * 2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 15, cy - 12, 6, 4 + Math.abs(Math.sin(offset)) * 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Plot grid points and small flashing coordinate texts
      facePoints.forEach((pt) => {
        // glowing point
        ctx.fillStyle = '#ff2a5f'; // Magenta warning eye nodes
        ctx.shadowColor = '#ff2a5f';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const jitter = Math.sin(offset * 2 + pt.x) * 1.5;
        ctx.arc(pt.x + jitter, pt.y + jitter, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // draw connection lines
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pt.x + jitter, pt.y + jitter);
        ctx.stroke();
      });

      ctx.restore();
    };

    const drawCyberGridOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number, sweepY: number) => {
      ctx.save();
      ctx.shadowBlur = 0;

      // Diagonal crosshairs in corners
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
      ctx.lineWidth = 1;
      const margin = 12;
      
      // Top Left Corner Bracket
      ctx.beginPath();
      ctx.moveTo(margin, margin + 8);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + 8, margin);
      ctx.stroke();

      // Top Right
      ctx.beginPath();
      ctx.moveTo(w - margin, margin + 8);
      ctx.lineTo(w - margin, margin);
      ctx.lineTo(w - margin - 8, margin);
      ctx.stroke();

      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(margin, h - margin - 8);
      ctx.lineTo(margin, h - margin);
      ctx.lineTo(margin + 8, h - margin);
      ctx.stroke();

      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(w - margin, h - margin - 8);
      ctx.lineTo(w - margin, h - margin);
      ctx.lineTo(w - margin - 8, h - margin);
      ctx.stroke();

      // Sweeping Laser Tracking line
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1.35;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(6, sweepY);
      ctx.lineTo(w - 6, sweepY);
      ctx.stroke();

      // Glowing scan flare
      const gradient = ctx.createLinearGradient(0, sweepY - 5, 0, sweepY + 5);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.0)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(6, sweepY - 8, w - 12, 16);

      ctx.restore();
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [hasCamera]);

  // Calculating colors for standard gauges
  const getGaugeColor = (val: number) => {
    if (val < 30) return '#ef4444'; // Red negative
    if (val < 65) return '#eab308'; // Yellow neutral
    return '#10b981'; // Green positive
  };

  return (
    <div id="emotional-telemetry-module" className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/10 p-5 shadow-2xl shadow-black/40 flex flex-col relative h-[380px] select-none group transition-all duration-300 hover:border-white/15">
      {/* Module Title B */}
      <div className="absolute top-4 left-4 bg-white/5 text-slate-300 border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
        MODULE B
      </div>

      <div className="flex justify-between items-start mb-1 mt-3 pl-1">
        <div>
          <h2 className="text-white text-base font-bold font-mono tracking-wide">EMOTIONAL TELEMETRY MODULE</h2>
          <p className="text-[#22d3ee]/60 text-[10px] uppercase font-mono tracking-wider">Simulated Real-Time Cognitive Scanning</p>
        </div>
        <button
          onClick={startCamera}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-mono tracking-wider transition-all uppercase font-bold border ${
            hasCamera 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
              : 'bg-white/10 hover:bg-white/20 text-white border-white/10 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {hasCamera ? <Check className="w-3 h-3 text-emerald-400" /> : <Camera className="w-3 h-3" />}
          {hasCamera ? 'TELEMETRY LIVE' : 'CONNECT CAMERA'}
        </button>
      </div>

      {hasCamera && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="hidden"
          width={320}
          height={240}
        />
      )}

      {/* Cyber Camera Tracking grid layout */}
      <div className="flex-1 min-h-0 flex gap-4 my-3 items-stretch">
        <div className="w-[50%] bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" width={170} height={180} />
          
          <div className="absolute bottom-1 right-2 bg-slate-950/80 border border-white/5 text-[7px] font-mono text-slate-400/80 px-1 py-0.5 rounded">
            SYS_SCAN_HZ: 60.0
          </div>
          
          <div className="absolute top-2 left-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[7.5px] font-mono px-1 py-0.5 rounded uppercase tracking-widest animate-pulse">
            MESH_ACTIVE
          </div>
        </div>

        {/* Gauges panel: Sentiment & Attention indices */}
        <div className="flex-1 flex flex-col justify-between py-1 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
          <div>
            <div className="text-[8.5px] font-mono font-bold text-slate-300/80 tracking-wider mb-2">OVERALL COGNITIVE SCORE METER</div>
            
            {/* Sentiment Meter Radial gauge simulator */}
            <div className="relative flex items-center justify-center h-20 mb-1">
              <svg className="w-20 h-20 transform -rotate-90">
                {/* Background arc */}
                <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                {/* Active progress arc */}
                <circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  stroke={getGaugeColor(sentiment)} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * sentiment * 0.75) / 100} // limited arc bounds
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-white text-xs font-bold font-mono leading-none">{sentiment.toFixed(0)}%</span>
                <span className="text-[6.5px] text-slate-400 font-mono tracking-wider mt-0.5 uppercase">SENTIMENT</span>
              </div>
            </div>
            
            <div className="flex justify-between text-[7px] font-mono text-slate-400/50 px-3 uppercase tracking-wider">
              <span>NEGATIVE</span>
              <span>POSITIVE</span>
            </div>
          </div>

          {/* Quick Metrics sliders */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-2.5">
            <div>
              <div className="flex justify-between text-[8px] font-mono text-slate-300/80 mb-1.5 uppercase tracking-wider">
                <span>ATTENTION ACCU</span>
                <span className="text-white font-bold">{attention.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${attention}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[8px] font-mono text-slate-300/80 mb-1.5 uppercase tracking-wider">
                <span>STRESS LOAD</span>
                <span className="text-white font-bold">{stress.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${stress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Diagnostics Output Block */}
      <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5 flex flex-col gap-1 text-[8.5px] font-mono text-cyan-300/80">
        <div className="flex justify-between">
          <span>GOVERNANCE ALIGNMENT:</span>
          <span className="text-emerald-400 font-bold">92.6% [BOUNDS SAFE]</span>
        </div>
        <div className="flex justify-between">
          <span>DECISION ALIGNMENT:</span>
          <span className="text-cyan-400 font-bold">88.2% [DETERMINISTIC]</span>
        </div>
        <div className="flex justify-between">
          <span>ANOMALY TELEMETRY:</span>
          <span className={anomalyCount > 0 ? "text-rose-400 font-bold animate-pulse" : "text-slate-400/50"}>
            {anomalyCount} DETECTED [STABLE]
          </span>
        </div>
      </div>
    </div>
  );
}
