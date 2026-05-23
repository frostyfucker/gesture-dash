import React, { useState, useEffect } from 'react';
import PhoneticConductor from './components/PhoneticConductor';
import EmotionalTelemetry from './components/EmotionalTelemetry';
import GovernancePanel from './components/GovernancePanel';
import PackageDocs from './components/PackageDocs';
import MarketIntelligence from './components/MarketIntelligence';
import LegendTour from './components/LegendTour';
import CouncilArc3D from './components/CouncilArc3D';
import GesturePad from './components/GesturePad';
import { TourStep } from './types';
import { audioSynth } from './components/AudioEngine';
import { Disc, Monitor, Settings, Shield, Terminal, Volume2, Sparkles, User, Orbit } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'CONSOLE' | 'COUNCIL_3D' | 'INTEGRATED'>('CONSOLE');
  const [globalLatency, setGlobalLatency] = useState(4.0); // ms
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState<number | null>(null);

  const tourSteps: TourStep[] = [
    {
      id: 0,
      title: 'Phonetic Conductor Module',
      target: 'phonetic-conductor-module',
      description: 'Rearrange IPA phoneme blocks to skew voice modulations, or drag the golden baton across the wave grid to synthesize custom phonetics.',
      badge: 'ACOUSTICS INITIALIZED'
    },
    {
      id: 1,
      title: 'Emotional Telemetry Scan',
      target: 'emotional-telemetry-module',
      description: 'Engage video streaming telemetry to map face coordinate matrices onto the active viewport, graphing real-time attention and posture index scores.',
      badge: 'COGNITIVE ACCU-TRACE LOCKED'
    },
    {
      id: 2,
      title: 'Global Governance Code',
      target: 'governance-node-section',
      description: 'Toggle compliance capabilities (e.g., Cryptographic Hash signing) or shift Strategic Directives to dynamically adjust verifying safety standards.',
      badge: 'SAFE COMPLIANCE DEPLOYED'
    },
    {
      id: 3,
      title: 'Core Module compiler status',
      target: 'package-status-section',
      description: 'Acknowledge compilation pass results, trace overall latency in microseconds, and search complete text manuals detailing active protocols.',
      badge: 'LATENCY DECAIED'
    },
    {
      id: 4,
      title: 'Holographic Gesture Pad',
      target: 'gesture-controller',
      description: 'Physically swipe gestures (Circle, Swipe Up, Swipe Down, Checkmark) on the tracking matrix to control board dashboard panels with motion command loops.',
      badge: 'MOTION AUTONOMY ENGAGED'
    }
  ];

  useEffect(() => {
    // Automatically initialize audio context on first user click of application
    const initCtx = () => {
      audioSynth.init();
      setAudioEnabled(true);
      window.removeEventListener('click', initCtx);
    };
    window.addEventListener('click', initCtx);
    return () => window.removeEventListener('click', initCtx);
  }, []);

  // Handle callback triggers from active drawn gestures
  const handleGestureRecognized = (gesture: string) => {
    if (gesture === 'Circle') {
      // Toggle 3D spatial space
      audioSynth.playSonar();
      if (activeView === 'CONSOLE') {
        setActiveView('COUNCIL_3D');
      } else if (activeView === 'COUNCIL_3D') {
        setActiveView('INTEGRATED');
      } else {
        setActiveView('CONSOLE');
      }
    } else if (gesture === 'Swipe Up') {
      // Traverse walkthrough next
      if (currentTourStep !== null) {
        handleNextTourStep();
      } else {
        handleStartTour();
      }
    } else if (gesture === 'Swipe Down') {
      // Walkthrough retro
      if (currentTourStep !== null && currentTourStep > 0) {
        setCurrentTourStep(currentTourStep - 1);
        audioSynth.playClick(500, 0.08);
      }
    } else if (gesture === 'Checkmark') {
      // Accelerate latency decay diagnostics
      audioSynth.playSonar();
      setGlobalLatency(prev => Math.max(1.0, prev - 1.5));
      setTimeout(() => {
        setGlobalLatency(prev => prev + 1.5);
      }, 5000);
    }
  };

  const handleStartTour = () => {
    setCurrentTourStep(0);
    audioSynth.playSonar();
  };

  const handleEndTour = () => {
    setCurrentTourStep(null);
    audioSynth.playClick(440, 0.1);
  };

  const handleNextTourStep = () => {
    if (currentTourStep === null) return;
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(currentTourStep + 1);
      audioSynth.playClick(700 + currentTourStep * 100, 0.08);
    } else {
      setCurrentTourStep(null);
      audioSynth.playSonar();
    }
  };

  const handlePrevTourStep = () => {
    if (currentTourStep === null || currentTourStep === 0) return;
    setCurrentTourStep(currentTourStep - 1);
    audioSynth.playClick(600, 0.08);
  };

  // Helper matching highlight style to active step
  const getHighlightClass = (elementId: string) => {
    if (currentTourStep === null) return '';
    const activeStep = tourSteps[currentTourStep];
    if (activeStep.target === elementId) {
      return 'border-[#00ffff] ring-[3px] ring-cyan-400/30 shadow-[0_0_35px_rgba(0,255,255,0.4)] scale-[1.01] relative z-20';
    }
    return 'opacity-[0.25] pointer-events-none transition-opacity duration-500';
  };

  const handleGovChange = (lat: number) => {
    setGlobalLatency(lat);
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 pb-10 relative overflow-x-hidden antialiased">
      
      {/* Frosted Glass ambient glowing orbs in the background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[33%] h-[33%] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Upper Brand Header Bar */}
      <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#22d3ee] shadow-sm shadow-cyan-400/20">
              <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold font-mono tracking-wider text-base">Orchestr<span className="text-[#00ffff]">AI-t</span></span>
              </div>
              <div className="text-[7.5px] font-mono text-slate-400 uppercase tracking-widest leading-none">Mixed Reality Platform Enclave</div>
            </div>
          </div>

          {/* Quick Stats Banner inside header */}
          <div className="hidden md:flex items-center gap-5 text-[9.5px] font-mono text-slate-300/80 border-x border-white/10 px-6">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SYS_ENCLAVE: ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>LATENCY:</span>
              <span className="text-white font-bold">{globalLatency.toFixed(1)}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>USER_KEY:</span>
              <span className="text-blue-400 truncate max-w-[120px]">frostyf478...</span>
            </div>
          </div>

          {/* Core View Selector Tabs */}
          <nav className="flex items-center gap-2">
            <div className="flex bg-white/[0.03] rounded-xl border border-white/10 p-1 backdrop-blur-md">
              <button
                onClick={() => { setActiveView('CONSOLE'); audioSynth.playClick(600, 0.05); }}
                className={`px-3 py-1 font-mono text-[9px] font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'CONSOLE' ? 'bg-white/10 text-white border border-white/15' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                2D DECK
              </button>
              <button
                onClick={() => { setActiveView('COUNCIL_3D'); audioSynth.playClick(700, 0.05); }}
                className={`px-3 py-1 font-mono text-[9px] font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'COUNCIL_3D' ? 'bg-white/10 text-white border border-white/15' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Orbit className="w-3 h-3 text-[#22d3ee]" />
                3D ARC
              </button>
              <button
                onClick={() => { setActiveView('INTEGRATED'); activeView !== 'INTEGRATED' && audioSynth.playSonar(); }}
                className={`px-3 py-1 font-mono text-[9px] font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'INTEGRATED' ? 'bg-white/10 text-white border border-white/15' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                COMBINED
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Acoustic Authorization Alert Overlay (for browser Audio restrictions) */}
      {!audioEnabled && (
        <div className="bg-white/[0.02] border-y border-white/10 py-2.5 px-4 shadow-lg text-center z-10 relative backdrop-blur-md">
          <p className="text-cyan-300 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            Click anywhere on screen to authorize immersive sound telemetry spatialization
          </p>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 mt-6 select-none relative">
        <div className="text-center mb-6 pl-1 select-none">
          <p className="text-cyan-500/60 font-mono text-[9.5px] uppercase tracking-widest">Featured Active Protocol Enclave</p>
          <h1 className="text-white text-xl font-bold font-mono tracking-wide mt-0.5">BRAND ORCHESTRATION PLATFORM</h1>
        </div>

        {/* Floating walkthrough target instruction dialogue bubble (Matching mockup step popover) */}
        {currentTourStep !== null && (
          <div className="max-w-xl mx-auto bg-white/[0.04] backdrop-blur-2xl border border-white/20 rounded-2xl p-4.5 mb-6 z-20 relative shadow-2xl shadow-black/40 animate-fade-in flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <User className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-300 text-[10px] font-mono leading-none font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 border border-amber-500/20 rounded-lg">
                    Instructional Node
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest leading-none">
                    Step {currentTourStep + 1} of {tourSteps.length}
                  </span>
                </div>
                <h3 className="text-white text-xs font-mono font-semibold uppercase tracking-widest mt-1.5">
                  {tourSteps[currentTourStep].title}
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1.5 font-sans font-normal">
                  {tourSteps[currentTourStep].description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-[8.5px] font-mono text-slate-400 font-semibold tracking-wider uppercase">
                  [ HINT: {tourSteps[currentTourStep].badge} ]
                </span>
                <div className="flex gap-2">
                  {currentTourStep > 0 && (
                    <button
                      onClick={handlePrevTourStep}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono border border-white/10 text-slate-300 rounded-xl transition-all font-semibold uppercase tracking-wider"
                    >
                      &lt; Previous
                    </button>
                  )}
                  <button
                    onClick={handleNextTourStep}
                    className="px-3.5 py-1 bg-[#00ffff] hover:scale-[1.02] text-slate-950 font-mono font-bold text-[10px] rounded-xl transition-all uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    {currentTourStep === tourSteps.length - 1 ? 'Complete' : 'Next >'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2D Deck view */}
        {activeView === 'CONSOLE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Module A */}
            <div className={`transition-all duration-500 ${getHighlightClass('phonetic-conductor-module')}`}>
              <PhoneticConductor />
            </div>

            {/* Module B */}
            <div className={`transition-all duration-500 ${getHighlightClass('emotional-telemetry-module')}`}>
              <EmotionalTelemetry />
            </div>

            {/* Layout Panels bottom bento row */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className={`transition-all duration-500 ${getHighlightClass('governance-node-section')}`}>
                <GovernancePanel onGovLatencyChange={handleGovChange} />
              </div>
              <div className={`transition-all duration-500 ${getHighlightClass('package-status-section')}`}>
                <PackageDocs latency={globalLatency} />
              </div>
              <div className={`transition-all duration-500 ${getHighlightClass('market-intel-section')}`}>
                <MarketIntelligence />
              </div>
              <div className={`transition-all duration-500 ${getHighlightClass('legend-tour-section')}`}>
                <LegendTour
                  currentTourStep={currentTourStep}
                  onStartTour={handleStartTour}
                  onNextStep={handleNextTourStep}
                  onPrevStep={handlePrevTourStep}
                  onEndTour={handleEndTour}
                  tourSteps={tourSteps}
                />
              </div>
            </div>

            {/* Gestures console controller row */}
            <div className={`lg:col-span-2 transition-all duration-500 ${getHighlightClass('gesture-controller')}`}>
              <GesturePad onGestureRecognized={handleGestureRecognized} />
            </div>
          </div>
        )}

        {/* 3D Orbit Boardroom View */}
        {activeView === 'COUNCIL_3D' && (
          <div className="animate-fade-in flex flex-col gap-6">
            <CouncilArc3D />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GesturePad onGestureRecognized={handleGestureRecognized} />
              <LegendTour
                currentTourStep={currentTourStep}
                onStartTour={handleStartTour}
                onNextStep={handleNextTourStep}
                onPrevStep={handlePrevTourStep}
                onEndTour={handleEndTour}
                tourSteps={tourSteps}
              />
            </div>
          </div>
        )}

        {/* Integrated Synergy view containing both */}
        {activeView === 'INTEGRATED' && (
          <div className="animate-fade-in flex flex-col gap-6">
            <CouncilArc3D />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className={`transition-all duration-500 ${getHighlightClass('phonetic-conductor-module')}`}>
                <PhoneticConductor />
              </div>
              <div className={`transition-all duration-500 ${getHighlightClass('emotional-telemetry-module')}`}>
                <EmotionalTelemetry />
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className={`transition-all duration-500 ${getHighlightClass('governance-node-section')}`}>
                  <GovernancePanel onGovLatencyChange={handleGovChange} />
                </div>
                <div className={`transition-all duration-500 ${getHighlightClass('package-status-section')}`}>
                  <PackageDocs latency={globalLatency} />
                </div>
                <div className={`transition-all duration-500 ${getHighlightClass('market-intel-section')}`}>
                  <MarketIntelligence />
                </div>
                <div className={`transition-all duration-500 ${getHighlightClass('legend-tour-section')}`}>
                  <LegendTour
                    currentTourStep={currentTourStep}
                    onStartTour={handleStartTour}
                    onNextStep={handleNextTourStep}
                    onPrevStep={handlePrevTourStep}
                    onEndTour={handleEndTour}
                    tourSteps={tourSteps}
                  />
                </div>
              </div>

              <div className={`lg:col-span-2 transition-all duration-500 ${getHighlightClass('gesture-controller')}`}>
                <GesturePad onGestureRecognized={handleGestureRecognized} />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer bar brand references */}
      <footer className="mt-12 border-t border-[#22d3ee]/15 pt-4 text-center select-none text-[#22d3ee]/40 text-[9px] font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <span>VaporNodes Core Implementation :: Orchestr-AI-t Brand Platform :: Q&A Session Integration</span>
          <span>© 2026 ORCHESTR-AI-T INC • SECURE BOUNDS GUARANTEED</span>
        </div>
      </footer>
    </div>
  );
}
