// Web Audio API Synthesizer for Tzeva Adom dual-tone siren & interface sound effects

class AudioAlertSystem {
  private audioCtx: AudioContext | null = null;
  private isSirenActive = false;
  private sirenNodes: {
    osc1?: OscillatorNode;
    osc2?: OscillatorNode;
    gainNode?: GainNode;
    intervalId?: number;
  } = {};

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Plays authentic Tzeva Adom dual-tone rising/falling emergency siren
   */
  startTzevaAdomSiren() {
    if (this.isSirenActive) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      this.isSirenActive = true;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Master gain for the siren
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.exponentialRampToValueAtTime(0.45, now + 0.3);
      masterGain.connect(ctx.destination);

      // Low frequency wail oscillator (480 Hz -> 840 Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(520, now);

      // High harmonic oscillator for authentic penetrating acoustic tone
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(860, now);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.5, now);

      osc1.connect(masterGain);
      osc2.connect(oscGain);
      oscGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);

      // Oscillate frequency up and down every 1.8 seconds (Tzeva Adom wail signature)
      let goingUp = true;
      const intervalId = window.setInterval(() => {
        if (!this.isSirenActive || !this.audioCtx) return;
        const t = this.audioCtx.currentTime;
        if (goingUp) {
          osc1.frequency.exponentialRampToValueAtTime(840, t + 0.9);
          osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.9);
        } else {
          osc1.frequency.exponentialRampToValueAtTime(460, t + 0.9);
          osc2.frequency.exponentialRampToValueAtTime(680, t + 0.9);
        }
        goingUp = !goingUp;
      }, 950);

      this.sirenNodes = { osc1, osc2, gainNode: masterGain, intervalId };
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  }

  /**
   * Stop the siren smoothly
   */
  stopTzevaAdomSiren() {
    if (!this.isSirenActive) return;
    this.isSirenActive = false;

    if (this.sirenNodes.intervalId) {
      clearInterval(this.sirenNodes.intervalId);
    }

    if (this.audioCtx && this.sirenNodes.gainNode) {
      const now = this.audioCtx.currentTime;
      try {
        this.sirenNodes.gainNode.gain.cancelScheduledValues(now);
        this.sirenNodes.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        setTimeout(() => {
          this.sirenNodes.osc1?.stop();
          this.sirenNodes.osc2?.stop();
          this.sirenNodes.osc1?.disconnect();
          this.sirenNodes.osc2?.disconnect();
          this.sirenNodes.gainNode?.disconnect();
          this.sirenNodes = {};
        }, 450);
      } catch {
        // cleanup fallback
      }
    }
  }

  getIsSirenActive() {
    return this.isSirenActive;
  }

  /**
   * Brief tactical blip sound for UI likes/reactions
   */
  playLikeChime() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Tactical ping for radar refresh / new alert incoming
   */
  playRadarPing() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1020, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const alertAudio = new AudioAlertSystem();
