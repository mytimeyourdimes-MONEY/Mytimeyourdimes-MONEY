/**
 * Web Audio API synthesizer for the catchy "My Time Your Dime" TikTok/Shorts ad soundtrack.
 * Generates an energetic, viral 128 BPM pop-trap groove with bouncy 808 bass, punchy drums,
 * catchy synth hooks, and timed sound effects (camera shutter, cash register, whoosh).
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentStep = 0;
  private timerId: number | null = null;
  private destNode: MediaStreamAudioDestinationNode | null = null;
  private masterGain: GainNode | null = null;
  private tempo = 128; // BPM
  private volume = 0.75;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.destNode = this.ctx.createMediaStreamDestination();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      // Connect to speakers AND destination stream (for video recording)
      this.masterGain.connect(this.ctx.destination);
      if (this.destNode) {
        this.masterGain.connect(this.destNode);
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMediaStream(): MediaStream | null {
    this.initContext();
    return this.destNode ? this.destNode.stream : null;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Kick drum (deep punch)
  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  // Snappy snare/clap
  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    
    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.15);

    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.08);

    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  // Closed hi-hat
  private playHiHat(time: number, accent = false) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.35 : 0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.04);
  }

  // Bouncy synth bass note
  private playBass(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + duration);

    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Upbeat catchy melodic hook note (bright bells / pluck)
  private playLead(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time); // Octave overtone

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  // Sound Effect: Camera Shutter (for Scene 2: Sell an item with photo)
  public playCameraSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // First click
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, t);
    osc1.frequency.exponentialRampToValueAtTime(200, t + 0.04);
    g1.gain.setValueAtTime(0.4, t);
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.04);

    // Second click (shutter release)
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2200, t + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(300, t + 0.12);
    g2.gain.setValueAtTime(0.5, t + 0.06);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t + 0.06);
    osc2.stop(t + 0.12);
  }

  // Sound Effect: Cash Register Cha-Ching! (for Scene 4: Dime Vault & Daily Payouts)
  public playCashRegisterSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Bell 1: high chime
    const bell1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(1800, t);
    g1.gain.setValueAtTime(0.6, t);
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    bell1.connect(g1);
    g1.connect(this.masterGain);
    bell1.start(t);
    bell1.stop(t + 0.5);

    // Bell 2: higher harmonic chime
    const bell2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(2700, t + 0.06);
    g2.gain.setValueAtTime(0.7, t + 0.06);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.65);
    bell2.connect(g2);
    g2.connect(this.masterGain);
    bell2.start(t + 0.06);
    bell2.stop(t + 0.65);

    // Coin clink
    const bell3 = this.ctx.createOscillator();
    const g3 = this.ctx.createGain();
    bell3.type = 'sine';
    bell3.frequency.setValueAtTime(3600, t + 0.12);
    g3.gain.setValueAtTime(0.5, t + 0.12);
    g3.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    bell3.connect(g3);
    g3.connect(this.masterGain);
    bell3.start(t + 0.12);
    bell3.stop(t + 0.4);
  }

  // Sound Effect: Whoosh transition
  public playWhooshSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(2200, t + 0.12);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.12);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.25);
  }

  // Sound Effect: Doorbell Chime (for Nationwide Shipping & Local Delivery)
  public playDoorbellSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // High chime (Ding)
    const bell1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(880, t); // A5
    g1.gain.setValueAtTime(0.5, t);
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    bell1.connect(g1);
    g1.connect(this.masterGain);
    bell1.start(t);
    bell1.stop(t + 0.4);

    // Lower chime (Dong)
    const bell2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(659.25, t + 0.18); // E5
    g2.gain.setValueAtTime(0.6, t + 0.18);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.65);
    bell2.connect(g2);
    g2.connect(this.masterGain);
    bell2.start(t + 0.18);
    bell2.stop(t + 0.65);
  }

  // Sound Effect: Victory Fanfare (Scene 5)
  public playFanfareSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      gain.gain.setValueAtTime(0.4, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.4);
    });
  }

  // Vocal Lyrics Speech Synthesis Engine
  public speakVocalLyric(rawLyric: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel(); // Stop any pending vocal

      // Clean lyrics of music symbols and emojis for clear vocal pronunciation
      const cleanText = rawLyric
        .replace(/[♪♫♬♩]/g, '')
        .replace(/[📦📍🚚📸💸⚡⏰🛠️🏡🤝🛡️💳💰🚀🌟👉★]/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.08; // Energetic, upbeat commercial tempo
      utterance.pitch = 1.15; // Bright, engaging vocal pitch
      utterance.volume = Math.min(1, this.volume * 1.2);

      // Attempt to pick a smooth English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is restricted
    }
  }

  public stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe ignore
      }
    }
  }

  // Starts the repeating catchy 128 BPM groove
  public startGroove() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;
    this.currentStep = 0;

    const stepDuration = 60 / this.tempo / 4; // 16th note in seconds (~0.117s)

    // Musical Scale: Pentatonic in C (C4, D4, E4, G4, A4, C5, D5, E5, G5)
    const melodyNotes = [
      523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51
    ];
    
    // Bass line progression: C (65Hz), G (49Hz), A (55Hz), F (43Hz)
    const bassFrequencies = [
      65.41, 65.41, 65.41, 65.41, // C2
      49.00, 49.00, 49.00, 49.00, // G1
      55.00, 55.00, 55.00, 55.00, // A1
      43.65, 43.65, 43.65, 43.65  // F1
    ];

    // Catchy lead pattern index per 16 steps
    const leadPattern = [
      0, null, 2, 3, null, 4, 3, null,
      2, 0, null, 4, 5, 4, 2, 0
    ];

    const schedule = () => {
      if (!this.isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const step = this.currentStep % 16;
      const barIndex = Math.floor(this.currentStep / 16) % 4;

      // Drums
      // Kick on beats 1, 5, 9, 13 (four-on-the-floor pulse)
      if (step % 4 === 0) {
        this.playKick(t);
      }

      // Snare on beats 4 and 12 (standard pop backbeat)
      if (step === 4 || step === 12) {
        this.playSnare(t);
      }

      // Hi-hats on every 8th note (0, 2, 4, 6...) with swing accent
      if (step % 2 === 0) {
        this.playHiHat(t, step % 4 === 2);
      }

      // Bassline (syncs with 16-bar chords)
      if (step === 0 || step === 3 || step === 6 || step === 10) {
        const bassFreq = bassFrequencies[barIndex * 4 + Math.floor(step / 4)];
        this.playBass(bassFreq, t, stepDuration * 2);
      }

      // Catchy lead hook
      const noteIdx = leadPattern[step];
      if (noteIdx !== null && noteIdx !== undefined) {
        const freq = melodyNotes[noteIdx];
        this.playLead(freq, t, stepDuration * 1.5);
      }

      this.currentStep++;
      this.timerId = window.setTimeout(schedule, stepDuration * 1000);
    };

    schedule();
  }

  public stopGroove() {
    this.isPlaying = false;
    this.stopVoice();
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public isSoundPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new AudioSynthesizer();
