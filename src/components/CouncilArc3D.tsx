import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Activity, HelpCircle, HardDrive, Cpu, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CouncilNode } from '../types';
import { audioSynth } from './AudioEngine';

export default function CouncilArc3D() {
  const [nodes, setNodes] = useState<CouncilNode[]>([
    { id: '1', name: 'Presiding (Roy)', title: 'PRESIDING', role: 'Boardroom Lead', activity: 'Reading metrics stream', health: 'Stable', metrics: { lat: '1.2ms', items: 12, completion: 98 }, angle: 0, yOffset: 15 },
    { id: '2', name: 'ZeroClaw (v0.7.4)', title: 'AGENT MESH', role: 'Agent Daemon v0.7.4', activity: 'Cron snapshot routing ready', health: 'Stable', metrics: { lat: '2.5ms', items: 6, completion: 100 }, angle: 60, yOffset: 0 },
    { id: '3', name: 'DevOps Node', title: 'MEMBER', role: 'Repo health monitoring', activity: 'Velocity tracking checks', health: 'Stable', metrics: { lat: '4.1ms', items: 18, completion: 94 }, angle: 120, yOffset: -5 },
    { id: '4', name: 'Strategic Node', title: 'MEMBER', role: 'Strategic directive parser', activity: 'Global governance sweep', health: 'Stable', metrics: { lat: '3.0ms', items: 3, completion: 100 }, angle: 180, yOffset: -10 },
    { id: '5', name: 'SecOps Node', title: 'MEMBER', role: 'Cryptographic hash signing', activity: 'Scanning network ports', health: 'Warning', metrics: { lat: '8.2ms', items: 25, completion: 82 }, angle: 240, yOffset: 5 },
    { id: '6', name: 'Telemetry Proxy', title: 'MEMBER', role: 'Real-time eye/focus tracker', activity: 'Face tracking calculations', health: 'Stable', metrics: { lat: '1.8ms', items: 2, completion: 99 }, angle: 300, yOffset: 20 },
  ]);

  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [activeNode, setActiveNode] = useState<CouncilNode | null>(nodes[0]);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([
    'ZEROCLAW: Wire cron job active [OK]',
    'BOARD_STATION: 3D Council Arc orbit locked',
    'METRICS_SNAP: Stable telemetry bounds matched'
  ]);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const startX = useRef(0);

  // Auto-Orbit a tiny bit slowly
  useEffect(() => {
    if (isOrbiting) return;
    const interval = setInterval(() => {
      setOrbitAngle(prev => (prev + 0.15) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [isOrbiting]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOrbiting(true);
    startX.current = e.clientX;
    audioSynth.playClick(800, 0.05);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOrbiting) return;
    const deltaX = e.clientX - startX.current;
    startX.current = e.clientX;
    setOrbitAngle(prev => (prev + deltaX * 0.45 + 360) % 360);
  };

  const handleMouseUp = () => {
    setIsOrbiting(false);
  };

  const triggerDiagnostic = (node: CouncilNode) => {
    if (isRunningDiagnostic) return;
    audioSynth.playSonar();
    setIsRunningDiagnostic(true);
    setDiagnosticLog(prev => [
      `SYS_TRACE: Querying ${node.name} on thread...`,
      ...prev
    ].slice(0, 5));

    setTimeout(() => {
      audioSynth.playClick(900, 0.1, 'sine');
      setDiagnosticLog(prev => [
        `TRACE_FIN: ${node.name} lat: ${node.metrics.lat} check [PASS]`,
        `SNAPSHOT: Active entries: ${node.metrics.items} processed`,
        ...prev
      ].slice(0, 5));
      setIsRunningDiagnostic(false);
    }, 1800);
  };

  // Convert angular coordinates of node to 3D CSS style coordinates (elliptical orbits)
  const getNodeStyle = (n: CouncilNode) => {
    const rad = ((n.angle + orbitAngle) * Math.PI) / 180;
    const ellipseR_X = 220; // horizontal stretch
    const ellipseR_Y = 60;  // vertical shrink for perspective

    // Translate coordinates
    const x = Math.sin(rad) * ellipseR_X;
    const z = Math.cos(rad) * ellipseR_Y; // Z-coordinate representing depth
    
    // Scale factor based on depth to mimic zoom
    const scale = 0.65 + ((z + ellipseR_Y) / (ellipseR_Y * 2)) * 0.45;
    const opacity = 0.2 + ((z + ellipseR_Y) / (ellipseR_Y * 2)) * 0.8;
    const zIndex = Math.round((z + ellipseR_Y) * 10);

    return {
      transform: `translate3d(${x}px, ${z + n.yOffset}px, 0px) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
    };
  };

  return (
    <div id="holographic-arc-space" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 mt-6 shadow-2xl shadow-black/40 max-w-6xl mx-auto flex flex-col gap-6 relative select-none overflow-hidden h-[540px] rounded-[32px] transition-all duration-300 hover:border-white/15">
      
      {/* Circuit artwork */}
      <div className="absolute top-3 left-4 p-3 text-[9px] font-mono text-slate-400/40 tracking-widest leading-none bg-white/[0.02] border border-white/5 rounded-lg">
        BOARD_SPATIAL_CALIBRATOR_V3.3 :: PORT_INGRESS: 3000
      </div>

      <div className="flex justify-between items-start border-b border-white/10 pb-3 mt-1.5 pt-7">
        <div>
          <h2 className="text-white text-lg font-bold font-mono tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" /> SPATIAL 3D COUNCIL ARC HOVER
          </h2>
          <p className="text-slate-400 text-xs uppercase font-mono tracking-widest mt-0.5">Isometric Multi-Node Autonomous Governance Console</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-[10px] font-mono px-3.5 py-1.5 rounded-xl text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ARC ROTATION: {orbitAngle.toFixed(0)}°
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch min-h-0">
        
        {/* Orbital interactive stage */}
        <div 
          className="flex-1 relative bg-white/[0.01] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing group h-[260px] lg:h-auto transition-all hover:bg-white/[0.02]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Instructions hover overlay */}
          <div className="absolute top-3 inset-x-0 text-center pointer-events-none z-10 select-none px-4">
            <p className="text-slate-400/60 text-[9px] font-mono uppercase tracking-widest leading-normal">
              Click & drag stage horizontally to rotation coordinates or orbit nodes
            </p>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-[8.5px] font-mono border border-white/10 px-2.5 py-1 rounded-lg text-cyan-400">
            METRICS: Active: 6 • Resolving: 0 • Status: STABLE
          </div>

          {/* Core hologram glowing chamber reactor center */}
          <div className="absolute w-24 h-11 bg-cyan-500/10 border-2 border-cyan-400/30 rounded-full blur-md opacity-35 animate-ping animate-duration-3000" />
          <div className="absolute flex flex-col items-center justify-center text-center shadow-lg pointer-events-none select-none">
            <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-400 animate-pulse">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[7.5px] font-mono text-cyan-400 tracking-widest uppercase mt-1">CORE SYNAPSE</span>
          </div>

          {/* 3D Nodes Projection Space */}
          <div className="relative w-[360px] h-[200px] flex items-center justify-center">
            {nodes.map((node) => {
              const style = getNodeStyle(node);
              const isActive = activeNode?.id === node.id;
              
              return (
                <div
                  key={node.id}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSynth.playClick(400 + parseInt(node.id) * 100, 0.08);
                    setActiveNode(node);
                  }}
                  className={`absolute p-3 rounded-2xl border transition-all duration-100 flex flex-col gap-1 items-center justify-center min-w-[125px] cursor-pointer shadow-lg select-none ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-110 z-30'
                      : 'bg-[#06090c]/85 backdrop-blur-md border-white/15 hover:border-cyan-400/60 hover:scale-105'
                  }`}
                >
                  <span className="text-[7.5px] font-mono text-cyan-400 font-bold uppercase tracking-widest">{node.title}</span>
                  
                  {/* Avatar schematic avatar silhouette */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                    node.health === 'Stable' 
                      ? 'border-emerald-400/30 text-emerald-300 bg-emerald-500/5' 
                      : 'border-yellow-500/30 text-yellow-300 bg-yellow-500/5'
                  }`}>
                    <Cpu className="w-4.5 h-4.5" />
                  </div>

                  <span className="text-[9.5px] font-semibold text-white truncate max-w-[110px] text-center font-sans">{node.name}</span>
                  
                  {/* Little pulsing indicator to demonstrate connection */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${node.health === 'Stable' ? 'bg-emerald-400 animate-ping' : 'bg-yellow-400 animate-pulse'}`} />
                    <span className="text-[6.5px] font-mono text-slate-400">LAT: {node.metrics.lat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Diagnostics panel */}
        <div className="w-full lg:w-[320px] bg-white/[0.02] rounded-2xl border border-white/10 p-4.5 flex flex-col justify-between h-[210px] lg:h-auto select-none relative">
          <div className="absolute top-3 right-4 text-[7.5px] font-mono text-slate-400/60 font-semibold uppercase">TERM_TTY: S9</div>
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-[9.5px] font-mono font-bold text-white uppercase tracking-wider">SELECTED NODE PROTOCOL</span>
              <span className="text-[8.5px] text-cyan-400 font-mono font-bold">NODE_{activeNode?.id}</span>
            </div>

            {activeNode ? (
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-[12.5px] font-bold text-cyan-300 font-mono">{activeNode.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{activeNode.role}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-[9px] font-mono">
                    <span className="text-slate-400 block text-[7px] uppercase">LAT RANGE</span>
                    <span className="text-white font-bold">{activeNode.metrics.lat}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-[9px] font-mono">
                    <span className="text-slate-400 block text-[7px] uppercase">COM RATE</span>
                    <span className="text-white font-bold">{activeNode.metrics.completion}%</span>
                  </div>
                </div>

                <div className="mt-1.5">
                  <span className="text-[7.5px] text-slate-400 uppercase font-mono tracking-wider block">CURRENT POE ACTIVITY</span>
                  <p className="text-[9px] font-mono italic text-emerald-300 truncate leading-normal">" {activeNode.activity} "</p>
                </div>
              </div>
            ) : (
              <div className="text-[9.5px] font-mono text-slate-400/50 italic text-center py-6">Select a boardroom node telemetry profile...</div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 mt-2 lg:mt-0">
            {/* Live diagnostic logger */}
            <div className="bg-slate-950/40 rounded-xl border border-white/5 p-2 text-[7.5px] font-mono flex flex-col gap-1">
              <span className="text-cyan-400 font-bold border-b border-white/5 pb-0.5 uppercase mb-1">LIVE LOG STREAM</span>
              {diagnosticLog.slice(0, 3).map((log, i) => (
                <div key={i} className="truncate text-cyan-300 flex items-center gap-1">
                  <span>⚡</span> <span className="opacity-90">{log}</span>
                </div>
              ))}
            </div>

            {activeNode && (
              <button
                onClick={() => triggerDiagnostic(activeNode)}
                disabled={isRunningDiagnostic}
                className={`w-full py-2.5 border rounded-xl font-mono text-[9px] font-semibold tracking-widest transition-all uppercase flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                  isRunningDiagnostic 
                    ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 cursor-wait' 
                    : 'border-white/10 text-white bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isRunningDiagnostic ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
                    RUNNING TELEMETRY SCOPE...
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    DEPLOY AGENT TRACE
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
