// Sound engine for NeuroVerse AI using HTML5 Web Audio API
// Generates synthesized futuristic sound effects dynamically to avoid heavy audio files.

class NeuroSoundEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private isMutedState: boolean = true;
  private backgroundHumOsc: OscillatorNode | null = null;
  private backgroundHumGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime); // default master level
      this.masterVolume.connect(this.ctx.destination);
      
      // Start background hum if not muted
      if (!this.isMutedState) {
        this.startBackgroundHum();
      }
    } catch (e) {
      console.warn("Failed to initialize Web Audio API:", e);
    }
  }

  setMute(mute: boolean) {
    this.isMutedState = mute;
    if (mute) {
      this.stopBackgroundHum();
      if (this.masterVolume && this.ctx) {
        this.masterVolume.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      this.init();
      if (this.ctx && this.masterVolume) {
        this.ctx.resume().then(() => {
          this.masterVolume!.gain.setValueAtTime(0.3, this.ctx!.currentTime);
          this.startBackgroundHum();
        });
      }
    }
  }

  isMuted() {
    return this.isMutedState;
  }

  private startBackgroundHum() {
    if (!this.ctx || !this.masterVolume || this.backgroundHumOsc) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, this.ctx.currentTime); // Deep low-frequency engine hum

      // Low pass filter to remove harshness
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime); // very subtle back hum

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);

      osc.start();

      this.backgroundHumOsc = osc;
      this.backgroundHumGain = gain;
    } catch (e) {
      console.warn("Could not start background hum:", e);
    }
  }

  private stopBackgroundHum() {
    if (this.backgroundHumOsc) {
      try {
        this.backgroundHumOsc.stop();
        this.backgroundHumOsc.disconnect();
      } catch (e) {}
      this.backgroundHumOsc = null;
    }
    if (this.backgroundHumGain) {
      this.backgroundHumGain.disconnect();
      this.backgroundHumGain = null;
    }
  }

  // Quick subtle UI tick/beep
  playTick() {
    if (this.isMutedState || !this.ctx || !this.masterVolume) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Interactive holographic selection click
  playClick() {
    if (this.isMutedState || !this.ctx || !this.masterVolume) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc2.start();
    osc.stop(this.ctx.currentTime + 0.16);
    osc2.stop(this.ctx.currentTime + 0.16);
  }

  // Futuristic scanning sweeps when transitioning chapters
  playSweep() {
    if (this.isMutedState || !this.ctx || !this.masterVolume) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  // AI Core transmission pulse when a query is made or AI thinks
  playTransmissionPulse() {
    if (this.isMutedState || !this.ctx || !this.masterVolume) return;
    this.resumeContext();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(300, now + 0.2);
    osc.frequency.linearRampToValueAtTime(200, now + 0.5);

    // subtle frequency vibrato to mimic AI data modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(25, now); // 25Hz modulation
    lfoGain.gain.setValueAtTime(15, now); // vibrato depth

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    let finalDest = this.masterVolume;
    if (panner) {
      panner.pan.setValueAtTime(-0.5, now);
      panner.pan.linearRampToValueAtTime(0.5, now + 0.6);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }
    gain.connect(finalDest);

    lfo.start();
    osc.start();
    lfo.stop(now + 0.7);
    osc.stop(now + 0.7);
  }

  // System warning or error sound
  playAlert() {
    if (this.isMutedState || !this.ctx || !this.masterVolume) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(330, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  private resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

export const soundEngine = new NeuroSoundEngine();
