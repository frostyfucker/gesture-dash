// Web Audio Synthesizer Engine for OrchestrAI-t Holographic Dashboard
class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.startAmbientHum();
    }
  }

  isInitialized() {
    return this.ctx !== null;
  }

  // Play a simple high-tech laser-beep/click
  playClick(freq: number = 800, duration: number = 0.08, type: OscillatorType = 'sine') {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Sweeping down frequency for sci-fi click
      osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context Click SFX Error:", e);
    }
  }

  // Play a sonar scanning chime
  playSonar() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1318.51, now + 0.1); // E6

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  // Synthesize a phonetic vowel format/sound
  playPhoneme(pitch: number = 220, type: 'ɔː' | 'ɛ' | 'eɪ' | 'r' | 'k' | 's' | 't') {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const duration = 0.25;

      if (type === 's' || type === 'k' || type === 't') {
        // Noise synthetic generator for unvoiced consonants
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        if (type === 's') {
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(4000, now);
          noiseGain.gain.setValueAtTime(0.03, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        } else if (type === 'k') {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1800, now);
          noiseGain.gain.setValueAtTime(0.05, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        } else { // 't' quick release click
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(6000, now);
          noiseGain.gain.setValueAtTime(0.06, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        }

        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noiseNode.start();
        return;
      }

      // Voiced sounds (oscillator with formant filters)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();

      const f1 = this.ctx.createBiquadFilter();
      const f2 = this.ctx.createBiquadFilter();
      const voiceGain = this.ctx.createGain();

      osc1.frequency.setValueAtTime(pitch, now);
      osc2.frequency.setValueAtTime(pitch * 2.01, now); // Harmonics

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      // Setting Formant (Vowel) frequencies roughly
      f1.type = 'bandpass';
      f2.type = 'bandpass';

      if (type === 'ɔː') {
        f1.frequency.setValueAtTime(570, now); // F1
        f1.Q.setValueAtTime(10, now);
        f2.frequency.setValueAtTime(840, now); // F2
        f2.Q.setValueAtTime(10, now);
      } else if (type === 'ɛ') {
        f1.frequency.setValueAtTime(530, now);
        f1.Q.setValueAtTime(8, now);
        f2.frequency.setValueAtTime(1840, now);
        f2.Q.setValueAtTime(8, now);
      } else if (type === 'eɪ') {
        f1.frequency.setValueAtTime(480, now);
        f1.frequency.exponentialRampToValueAtTime(350, now + duration);
        f1.Q.setValueAtTime(8, now);
        f2.frequency.setValueAtTime(1700, now);
        f2.frequency.exponentialRampToValueAtTime(2100, now + duration);
        f2.Q.setValueAtTime(8, now);
      } else { // 'r'
        f1.frequency.setValueAtTime(310, now);
        f1.Q.setValueAtTime(12, now);
        f2.frequency.setValueAtTime(1050, now);
        f2.Q.setValueAtTime(12, now);
      }

      voiceGain.gain.setValueAtTime(0.08, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(f1);
      osc2.connect(f2);
      f1.connect(voiceGain);
      f2.connect(voiceGain);
      voiceGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn("Speech Synthesis Error:", e);
    }
  }

  // Play gesture recognition chime
  playGestureSuccess(gestureName: string) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      if (gestureName === 'Circle') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
      } else if (gestureName === 'Swipe Up' || gestureName === 'Swipe Down') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(gestureName === 'Swipe Up' ? 900 : 300, now + 0.2);
      } else { // Checkmark
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.2); // C6
      }

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Continuous ambient hum to mimic holograms
  private startAmbientHum() {
    if (!this.ctx) return;
    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A hum
      this.ambientGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
    } catch (e) {
      console.warn("Error starting sound hum:", e);
    }
  }

  setAmbientVolume(vol: number) {
    if (!this.ambientGain || !this.ctx) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.05, vol * 0.02)), this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  stop() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
      } catch (e) {}
    }
    this.ctx = null;
  }
}

export const audioSynth = new AudioSynthEngine();
