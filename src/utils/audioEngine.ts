// Web Audio procedural background music & sound effects synthesizer
class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private loopInterval: number | null = null;
  private currentVoiceAudio: HTMLAudioElement | null = null;
  private isDucked: boolean = false;
  private masterMusicVolume: number = 0.3;

  public initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.masterMusicVolume, this.ctx.currentTime);
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a smooth cinematic chord progression (Cmaj9 -> Am9 -> Fmaj7 -> Gsus4)
  private playWarmChord(freqs: number[], duration: number, time: number) {
    if (!this.ctx || !this.musicGainNode) return;

    freqs.forEach((freq, i) => {
      try {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 150, time);
        filter.Q.setValueAtTime(1.1, time);

        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.04 / freqs.length, time + 1.0);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.2);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.musicGainNode!);

        osc.start(time);
        osc.stop(time + duration);
      } catch (e) {
        // Safe catch for AudioContext timing
      }
    });
  }

  // Play gentle rhythmic acoustic pulse / piano-like pluck
  private playPluck(freq: number, time: number) {
    if (!this.ctx || !this.musicGainNode) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.02, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(time);
      osc.stop(time + 1.3);
    } catch (e) {
      // Safe catch
    }
  }

  // Sound Effect: Elevator Arrival Chime ("Ding-Dong")
  public playElevatorDing() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      [
        { freq: 784, time: now, dur: 0.8 },      // G5
        { freq: 1046.5, time: now + 0.2, dur: 1.2 }, // C6
      ].forEach((tone) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, tone.time);

        gain.gain.setValueAtTime(0, tone.time);
        gain.gain.linearRampToValueAtTime(0.12, tone.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, tone.time + tone.dur);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);

        osc.start(tone.time);
        osc.stop(tone.time + tone.dur);
      });
    } catch (e) {}
  }

  // Sound Effect: Car Arrival & Door Whoosh
  public playCarArrivalWhoosh() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 1.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 1.6);
    } catch (e) {}
  }

  public startBackgroundMusic() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const chords = [
      // Cmaj9 (C3, G3, B3, D4, E4)
      [130.81, 196.00, 246.94, 293.66, 329.63],
      // Am9 (A2, E3, G3, B3, C4)
      [110.00, 164.81, 196.00, 246.94, 261.63],
      // Fmaj7 (87.31, 174.61, 220.00, 261.63, 329.63)
      [87.31, 174.61, 220.00, 261.63, 329.63],
      // Gsus4 -> G (98.00, 196.00, 261.63, 293.66, 392.00)
      [98.00, 196.00, 246.94, 293.66, 392.00],
    ];

    const chordDuration = 4.0;
    const progressionLength = chords.length * chordDuration;

    const scheduleCycle = (startTime: number) => {
      chords.forEach((chord, idx) => {
        const chordTime = startTime + idx * chordDuration;
        this.playWarmChord(chord, chordDuration + 0.6, chordTime);

        // Sub-pulses for modern architectural feel
        for (let p = 0; p < 4; p++) {
          const pluckTime = chordTime + p * 1.0;
          const note = chord[(idx + p) % chord.length] * 2;
          this.playPluck(note, pluckTime);
        }
      });
    };

    const startTime = this.ctx!.currentTime + 0.05;
    scheduleCycle(startTime);

    let nextTime = startTime + progressionLength;
    this.loopInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      scheduleCycle(nextTime);
      nextTime += progressionLength;
    }, (progressionLength - 1.0) * 1000);
  }

  public stopBackgroundMusic() {
    this.isPlaying = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    if (this.musicGainNode && this.ctx) {
      try {
        this.musicGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      } catch (e) {}
    }
  }

  public setMusicVolume(volume: number) {
    this.masterMusicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode && this.ctx) {
      try {
        const target = this.isDucked ? this.masterMusicVolume * 0.35 : this.masterMusicVolume;
        this.musicGainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
      } catch (e) {}
    }
  }

  // Auto-duck background music during voiceover narration
  public duckMusic(duck: boolean) {
    this.isDucked = duck;
    if (this.musicGainNode && this.ctx) {
      try {
        const target = duck ? this.masterMusicVolume * 0.35 : this.masterMusicVolume;
        this.musicGainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
      } catch (e) {}
    }
  }

  public playAudioBase64(base64: string, onEnded?: () => void) {
    this.stopVoice();
    this.duckMusic(true);

    try {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      this.currentVoiceAudio = audio;

      audio.onended = () => {
        this.duckMusic(false);
        this.currentVoiceAudio = null;
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        this.duckMusic(false);
        this.currentVoiceAudio = null;
        if (onEnded) onEnded();
      };

      audio.play().catch(() => {
        this.duckMusic(false);
      });
    } catch (e) {
      this.duckMusic(false);
      if (onEnded) onEnded();
    }
  }

  public stopVoice() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
      } catch (e) {}
      this.currentVoiceAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.duckMusic(false);
  }

  // Robust, guaranteed browser speech synthesis
  public speakFallback(text: string, onEnded?: () => void) {
    this.stopVoice();
    if (!('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    try {
      window.speechSynthesis.resume();
      this.duckMusic(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const bestVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Daniel') ||
              v.name.includes('David') ||
              v.name.includes('Male') ||
              v.name.includes('Google US English') ||
              v.name.includes('Natural'))
        );
        if (bestVoice) utterance.voice = bestVoice;
      }

      utterance.onend = () => {
        this.duckMusic(false);
        if (onEnded) onEnded();
      };

      utterance.onerror = () => {
        this.duckMusic(false);
        if (onEnded) onEnded();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.duckMusic(false);
      if (onEnded) onEnded();
    }
  }
}

export const audioEngine = new CinematicAudioEngine();
