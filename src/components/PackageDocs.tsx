import React, { useState } from 'react';
import { Package, BookOpen, Terminal, CheckCircle2, ShieldClose } from 'lucide-react';
import { audioSynth } from './AudioEngine';

interface PackageDocsProps {
  latency: number;
}

export default function PackageDocs({ latency }: PackageDocsProps) {
  const [buildPass, setBuildPass] = useState(true);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [docTermOpen, setDocTermOpen] = useState(false);
  const [searchDoc, setSearchDoc] = useState('');

  const docData = [
    { title: 'OrchestrAI-t Phonetics SDK', tags: 'conductor, voice, synthetic', desc: 'Allows developers to write custom orchestration structures for phonetic voice. Utilizes low-frequency wave modulations.' },
    { title: 'Cognitive Eye Telemetry V2', tags: 'posture, face mesh, emotion', desc: 'Captures and tracks orbital points overlaying a Web Camera feed to output cognitive interest.' },
    { title: 'ZeroClaw Agent Mesh Protocol', tags: 'mesh, devops, spanner', desc: 'Self-healing, distributed agent matrix that monitors server health, telemetry and triggers autonomous database migrations.' },
    { title: 'Strategic Directive Governance Code', tags: 'laws, policy, cobalt', desc: 'Pre-requisite compliance algorithms validating compliance matrices prior to package deployment.' }
  ];

  const triggerTestSuite = () => {
    if (isRunningTests) return;
    audioSynth.playClick(900, 0.1, 'sawtooth');
    setIsRunningTests(true);
    setBuildPass(false); // neutralizing while testing

    setTimeout(() => {
      audioSynth.playSonar();
      setIsRunningTests(false);
      setBuildPass(true);
    }, 2000);
  };

  const handleOpenDocs = () => {
    audioSynth.playClick(750, 0.1);
    setDocTermOpen(!docTermOpen);
  };

  const filteredDocs = docData.filter(d => 
    d.title.toLowerCase().includes(searchDoc.toLowerCase()) || 
    d.tags.toLowerCase().includes(searchDoc.toLowerCase())
  );

  return (
    <div id="package-status-section" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl shadow-black/40 flex flex-col justify-between h-[250px] relative transition-all duration-300 hover:border-white/15 group">
      <div className="absolute top-3 right-4 text-[8px] font-mono text-slate-400/60">MD_PKG_HASH: B55A</div>
      
      <div className="flex items-center gap-2 mb-2">
        <Package className="w-4 h-4 text-[#eab308] animate-bounce" />
        <h3 className="text-xs font-mono font-bold text-white tracking-widest">2. MODULE STATUS & DOCUMENT</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 mb-2">
        {/* Pass state status */}
        <div className="flex justify-between items-center text-[10.5px] font-mono leading-tight">
          <span className="text-slate-400">ORCHESTRA BUILD STATUS:</span>
          {isRunningTests ? (
            <span className="text-[#eab308] font-bold animate-pulse">REBUILDING MESH...</span>
          ) : buildPass ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> PASS
            </span>
          ) : (
            <span className="text-red-400 font-bold">ERROR</span>
          )}
        </div>

        {/* Live calculated logic latency */}
        <div className="flex justify-between items-center text-[10.5px] font-mono">
          <span className="text-slate-400">VERIFIED LOGIC LATENCY:</span>
          <span className="text-white font-bold text-xs">{latency.toFixed(1)}ms</span>
        </div>
      </div>

      {/* Primary Action Button view doc */}
      <div className="flex gap-2 relative z-10">
        <button
          onClick={handleOpenDocs}
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-mono text-[9px] py-2 transition-all font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {docTermOpen ? 'CLOSE MANUALS' : 'VIEW DOCUMENTATION'}
        </button>

        <button
          onClick={triggerTestSuite}
          disabled={isRunningTests}
          className="px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          title="Run diagnostic tests"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Holographic Docs overlay panel (opens inline and glows) */}
      {docTermOpen && (
        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl border border-white/20 rounded-[24px] p-4.5 flex flex-col justify-between z-20 shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400 animate-pulse" /> CORE DOCUMENTS MANUAL
            </span>
            <button 
              onClick={() => setDocTermOpen(false)} 
              className="text-red-400 text-[9px] font-mono border border-red-500/20 px-1.5 py-0.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
            >
              ESC
            </button>
          </div>

          <input
            type="text"
            placeholder="Search docs index... (e.g. eye, mesh)"
            value={searchDoc}
            onChange={(e) => setSearchDoc(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1 text-[9.5px] font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/[0.06] outline-none mb-2"
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 max-h-[140px] pr-1">
            {filteredDocs.length === 0 ? (
              <div className="text-[9px] font-mono text-slate-400/50 italic text-center py-4">No matching manuals found.</div>
            ) : (
              filteredDocs.map((doc, dIdx) => (
                <div key={dIdx} className="bg-white/[0.02] border border-white/5 p-2 rounded-xl">
                  <div className="text-[9.5px] font-bold text-white font-mono">{doc.title}</div>
                  <div className="text-[8px] text-slate-300 font-mono italic mt-0.5 leading-normal">{doc.desc}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
