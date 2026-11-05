/**
 * Web Audio API and Speech Synthesis engine for Morning Miracles.
 * Generates Solfeggio sacred frequencies, singing bowl chimes,
 * binaural sleep frequencies, and speech narration.
 */

export type VoiceGender = 'female' | 'male';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientBufferSource: AudioBufferSourceNode | null = null;
  private pranayamaGain: GainNode | null = null;
  private pranayamaOscillators: OscillatorNode[] = [];

  public initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Stop any ongoing Solfeggio frequency tone cleanly with zero clicks or ticks
   */
  public stopAllTones(): void {
    if (!this.ctx) return;

    // Snapshot current active nodes so cleanup never cancels newly spawned tones
    const oscsToStop = [...this.activeOscillators];
    const gainsToStop = [...this.activeGainNodes];
    this.activeOscillators = [];
    this.activeGainNodes = [];

    const now = this.ctx.currentTime;
    gainsToStop.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        // setTargetAtTime provides a smooth exponential curve to silence without click/tick
        gain.gain.setTargetAtTime(0.00001, now, 0.025);
      } catch {
        // ignore
      }
    });

    setTimeout(() => {
      oscsToStop.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      gainsToStop.forEach((g) => {
        try {
          g.disconnect();
        } catch {
          // ignore
        }
      });
    }, 120);
  }

  /**
   * Play a pure, pristine Solfeggio frequency with crystal clarity (no ticks, no flutter, no distortion)
   */
  public playFrequency(freq: number, volume: number = 0.28): () => void {
    this.stopAllTones();

    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Master tone gain with smooth attack curve to prevent transient click
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.setTargetAtTime(volume, now, 0.04);

    // Smoothing filter to prevent any high-frequency switching or quantization ticks
    const smoothFilter = ctx.createBiquadFilter();
    smoothFilter.type = 'lowpass';
    smoothFilter.frequency.setValueAtTime(3200, now);
    smoothFilter.Q.setValueAtTime(0.707, now); // Butterworth characteristic, maximally flat

    masterGain.connect(smoothFilter);
    smoothFilter.connect(ctx.destination);

    // Pure, crystal-clear fundamental sine wave for sacred Solfeggio resonance
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(masterGain);
    osc.start(now);

    this.activeOscillators.push(osc);
    this.activeGainNodes.push(masterGain);

    return () => this.stopAllTones();
  }

  /**
   * Dynamically adjust active Solfeggio tone volume without pops
   */
  public setToneVolume(volume: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.activeGainNodes.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(Math.max(0.0001, volume), now, 0.03);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Play crystal water alchemy sip chime (peaceful high bell resonance)
   */
  public playWaterSipChime(sipNumber: number = 1): void {
    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Musical scale based on 528Hz Miracle frequency progression
    const baseFreqs = [528, 594, 660, 704, 792, 880, 1056];
    const pitch = baseFreqs[(sipNumber - 1) % baseFreqs.length];

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 1.85);

    // Shimmer overtone
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(pitch * 2.5, now);
    const shimGain = ctx.createGain();
    shimGain.gain.setValueAtTime(0.08, now);
    shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    shimmer.connect(shimGain);
    shimGain.connect(ctx.destination);
    shimmer.start(now);
    shimmer.stop(now + 1.25);
  }

  /**
   * Play Evening Theta Binaural Beat (432Hz base with 4Hz theta difference)
   */
  public playEveningThetaBeat(volume: number = 0.22): () => void {
    this.stopAllTones();
    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const baseFreq = 432;
    const beatFreq = 4.0;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.3);
    masterGain.connect(ctx.destination);

    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq - beatFreq / 2, now);
    oscLeft.connect(masterGain);
    oscLeft.start(now);

    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq / 2, now);
    oscRight.connect(masterGain);
    oscRight.start(now);

    this.activeOscillators.push(oscLeft, oscRight);
    this.activeGainNodes.push(masterGain);

    return () => this.stopAllTones();
  }

  /**
   * Play soothing morning dawn ambience (pink noise stream + soft binaural singing resonance)
   */
  public playDawnAmbience(volume: number = 0.18): () => void {
    this.stopDawnAmbience();

    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.8);
    gain.connect(ctx.destination);
    this.ambientGain = gain;

    // Harmonic singing tone (216Hz and 324Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, now);
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.setValueAtTime(0.35, now);
    osc1.connect(osc1Gain);
    osc1Gain.connect(gain);
    osc1.start(now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(324, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.2, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gain);
    osc2.start(now);

    this.ambientOscillators.push(osc1, osc2);

    // Filtered pink noise for flowing water
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.Q.setValueAtTime(1.2, now);

      whiteNoise.connect(filter);
      filter.connect(gain);
      whiteNoise.start(now);
      this.ambientBufferSource = whiteNoise;
    } catch {
      // noise buffer optional
    }

    return () => this.stopDawnAmbience();
  }

  public stopDawnAmbience(): void {
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      this.ambientOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.ambientOscillators = [];
      if (this.ambientBufferSource) {
        try {
          this.ambientBufferSource.stop();
          this.ambientBufferSource.disconnect();
        } catch {
          // ignore
        }
        this.ambientBufferSource = null;
      }
      this.ambientGain = null;
    }, 450);
  }

  /**
   * Play mild dawn background soundscape for pranayama breathwork (432Hz ambient drone)
   */
  public playPranayamaBackground(volume: number = 0.08): () => void {
    this.stopPranayamaBackground();

    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.setTargetAtTime(volume, now, 0.4);
    gain.connect(ctx.destination);
    this.pranayamaGain = gain;

    // Filter to keep background gentle, mild, warm and non-intrusive
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.connect(gain);

    // Warm 432 Hz grounding sine wave
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, now);
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.setValueAtTime(0.3, now);
    osc1.connect(osc1Gain);
    osc1Gain.connect(filter);
    osc1.start(now);

    // Deep 108 Hz calming sub drone
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(108, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.25, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    osc2.start(now);

    // Ethereal 648 Hz fifth overtone for cosmic serenity
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(648, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.08, now);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);
    osc3.start(now);

    this.pranayamaOscillators.push(osc1, osc2, osc3);

    return () => this.stopPranayamaBackground();
  }

  public stopPranayamaBackground(): void {
    if (this.pranayamaGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.pranayamaGain.gain.cancelScheduledValues(now);
        this.pranayamaGain.gain.setTargetAtTime(0.00001, now, 0.08);
      } catch {
        // ignore
      }
    }

    const oscs = [...this.pranayamaOscillators];
    this.pranayamaOscillators = [];
    setTimeout(() => {
      oscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      if (this.pranayamaGain) {
        try {
          this.pranayamaGain.disconnect();
        } catch {
          // ignore
        }
        this.pranayamaGain = null;
      }
    }, 200);
  }

  /**
   * Soft dawn chime bowl for breath transitions
   */
  public playSoftChime(pitch: number = 528): void {
    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Speak text with gender choice ('female' | 'male')
   */
  public speakText(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      gender?: VoiceGender;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    } = {}
  ): void {
    if (!('speechSynthesis' in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const gender = options.gender || 'female';

    utterance.rate = options.rate ?? 0.88; // Meditative, calm pacing
    utterance.volume = options.volume ?? 1.0;

    // Pitch: slightly higher for female, lower and deeper for male
    if (gender === 'female') {
      utterance.pitch = options.pitch ?? 1.05;
    } else {
      utterance.pitch = options.pitch ?? 0.88;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (gender === 'female') {
      selectedVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (name.includes('female') ||
            name.includes('samantha') ||
            name.includes('karen') ||
            name.includes('victoria') ||
            name.includes('zira') ||
            name.includes('susan') ||
            name.includes('catherine') ||
            name.includes('google us english') ||
            name.includes('natural female'))
        );
      });
    } else {
      selectedVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (name.includes('male') ||
            name.includes('daniel') ||
            name.includes('david') ||
            name.includes('george') ||
            name.includes('alex') ||
            name.includes('fred') ||
            name.includes('rishi') ||
            name.includes('oliver') ||
            name.includes('google uk english male'))
        );
      });
    }

    // Fallback: pick any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop speech synthesis
   */
  public stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isContextActive(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }
}

export const audioSynth = new AudioSynthesizer();
