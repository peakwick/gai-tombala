import { useRef, useEffect, useCallback } from 'react';

// --- Sound Data and Types ---
type PianoKey = 'C3' | 'C#3' | 'D#3' | 'C4' | 'D4' | 'E4' | 'G4';
const PIANO_KEYS: Record<PianoKey, number> = {
  C3: 130.81, 'C#3': 138.59, 'D#3': 155.56,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00,
};

interface SoundNote {
  key?: PianoKey;
  freq?: number;
  duration: number;
}

interface SoundConfig {
  type?: OscillatorType;
  volume?: number;
  easeOut?: boolean;
}

interface ActiveSound {
    oscillator: OscillatorNode;
    gainNode: GainNode;
}

// Exported types for use in other hooks
export type DrawSoundName = 'draw_blip_classic' | 'draw_phone_tone' | 'draw_retro' | 'draw_scifi' | 'draw_bubble';
export type WinSoundName = 'win_musical' | 'win_fanfare' | 'win_cinko';
export type SoundName = DrawSoundName | WinSoundName;

const WIN_SOUND_SEQUENCES: Record<string, SoundNote[]> = {
  WIN_MUSICAL: [{ key: 'C4', duration: 0.175 }, { key: 'D4', duration: 0.175 }, { key: 'E4', duration: 0.175 }, { key: 'G4', duration: 0.275 }, { key: 'E4', duration: 0.15 }, { key: 'G4', duration: 0.9 }],
  WIN_FANFARE: [{ key: 'C4', duration: 0.2 }, { key: 'G4', duration: 0.4 }],
  CINKO: [{ key: 'C4', duration: 0.15 }, { key: 'E4', duration: 0.3 }],
};

const SOUND_DEFINITIONS: Record<DrawSoundName, { draw: SoundNote[], drawConfig: SoundConfig, spin: SoundNote[], spinConfig: SoundConfig }> = {
    'draw_blip_classic': {
        draw: [{ freq: 800, duration: 0.15 }],
        drawConfig: { type: 'square', volume: 0.2, easeOut: true },
        spin: [{ freq: 900, duration: 0.1 }, { freq: 700, duration: 0.1 }],
        spinConfig: { type: 'square', volume: 0.15, easeOut: false },
    },
    'draw_phone_tone': {
        draw: [{ freq: 1000, duration: 0.1 }],
        drawConfig: { type: 'sine', volume: 0.4, easeOut: true },
        spin: [{ freq: 1200, duration: 0.08 }, { freq: 1000, duration: 0.08 }],
        spinConfig: { type: 'sine', volume: 0.2, easeOut: false },
    },
    'draw_retro': {
        draw: [{ freq: 600, duration: 0.4 }],
        drawConfig: { type: 'square', volume: 0.2, easeOut: true },
        spin: [{ key: 'D#3', duration: 0.1 }, { key: 'C#3', duration: 0.1 }, { key: 'C3', duration: 0.1 }],
        spinConfig: { type: 'triangle', volume: 0.4, easeOut: false },
    },
    'draw_scifi': {
        draw: [{ freq: 1500, duration: 0.05 }, { freq: 500, duration: 0.1 }],
        drawConfig: { type: 'sawtooth', volume: 0.2, easeOut: true },
        spin: [{ freq: 1500, duration: 0.07 }, { freq: 1000, duration: 0.07 }, { freq: 500, duration: 0.07 }],
        spinConfig: { type: 'sawtooth', volume: 0.1, easeOut: false },
    },
    'draw_bubble': {
        draw: [{ freq: 300, duration: 0.2 }],
        drawConfig: { type: 'triangle', volume: 0.5, easeOut: true },
        spin: [{ freq: 400, duration: 0.12 }, { freq: 300, duration: 0.12 }],
        spinConfig: { type: 'triangle', volume: 0.3, easeOut: false },
    },
};

const WIN_SOUND_DEFINITIONS: Record<WinSoundName, { seq: SoundNote[], config: SoundConfig }> = {
    'win_musical': { seq: WIN_SOUND_SEQUENCES.WIN_MUSICAL, config: { type: 'triangle', volume: 0.5, easeOut: true } },
    'win_fanfare': { seq: WIN_SOUND_SEQUENCES.WIN_FANFARE, config: { type: 'triangle', volume: 0.5, easeOut: true } },
    'win_cinko': { seq: WIN_SOUND_SEQUENCES.CINKO, config: { type: 'sine', volume: 0.5, easeOut: true } },
};


// --- The Custom Hook ---
export const useSoundManager = (soundEnabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSoundSourceRef = useRef<ActiveSound | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopCurrentSound = useCallback(() => {
    if (activeSoundSourceRef.current && audioContextRef.current) {
      const { oscillator, gainNode } = activeSoundSourceRef.current;
      const { currentTime } = audioContextRef.current;
      gainNode.gain.cancelScheduledValues(currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.05);
      oscillator.stop(currentTime + 0.05);
      activeSoundSourceRef.current = null;
    }
  }, []);

  const playNoteSequence = useCallback((
    notes: SoundNote[],
    { type = 'sine', volume = 0.5, easeOut = true }: SoundConfig = {}
  ) => {
    if (!soundEnabled || typeof window === 'undefined') return;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    stopCurrentSound();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    activeSoundSourceRef.current = { oscillator, gainNode };

    oscillator.type = type;
    const { currentTime } = audioContext;
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.01);
    
    let totalDuration = 0;
    notes.forEach(note => {
        const freq = note.key ? PIANO_KEYS[note.key] : note.freq || 0;
        if (freq > 0) {
            oscillator.frequency.setValueAtTime(freq, currentTime + totalDuration);
        }
        totalDuration += note.duration;
    });

    if (easeOut) {
        gainNode.gain.setValueAtTime(volume, Math.max(currentTime, currentTime + totalDuration - 0.1));
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + totalDuration);
    } else {
        const rampDownTime = 0.01;
        gainNode.gain.setValueAtTime(volume, currentTime + totalDuration - rampDownTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + totalDuration);
    }

    oscillator.start(currentTime);
    oscillator.stop(currentTime + totalDuration);

  }, [soundEnabled, stopCurrentSound]);

  const playSound = useCallback((soundName: SoundName) => {
    if (!soundEnabled) return;
    if (soundName in WIN_SOUND_DEFINITIONS) {
        const sound = WIN_SOUND_DEFINITIONS[soundName as WinSoundName];
        playNoteSequence(sound.seq, sound.config);
    } else if (soundName in SOUND_DEFINITIONS) {
        const sound = SOUND_DEFINITIONS[soundName as DrawSoundName];
        playNoteSequence(sound.draw, sound.drawConfig);
    }
  }, [soundEnabled, playNoteSequence]);
  
  const playSpinSound = useCallback((drawSoundName: DrawSoundName, durationInSeconds: number) => {
    if (!soundEnabled || !SOUND_DEFINITIONS[drawSoundName]) return;

    const { spin: musicNotes, spinConfig: config } = SOUND_DEFINITIONS[drawSoundName];
    
    const noteDuration = musicNotes.reduce((acc, note) => acc + note.duration, 0) / musicNotes.length;
    if (noteDuration === 0) return;

    const noteCount = Math.floor(durationInSeconds / noteDuration);
    const fullSequence = Array.from({ length: noteCount }, (_, i) => musicNotes[i % musicNotes.length]);
    
    playNoteSequence(fullSequence, config);
  }, [soundEnabled, playNoteSequence]);

  return { playSound, playSpinSound };
};