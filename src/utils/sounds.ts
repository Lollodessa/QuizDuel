import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

type SoundKey = 'spin' | 'beep' | 'go' | 'select';

const SOURCES: Record<SoundKey, number> = {
  spin:   require('../../assets/sounds/spin.mp3'),
  beep:   require('../../assets/sounds/beep.mp3'),  // countdown 3-2-1
  go:     require('../../assets/sounds/go.mp3'),    // countdown VIA!
  select: require('../../assets/sounds/select.mp3'),// ruota si ferma
};

// Only the looping spin sound needs a persistent player.
// One-shot sounds (beep, go) get a fresh player each call — no seek-to-zero needed.
let spinPlayer: AudioPlayer | null = null;
let ready = false;

export function initSounds(): void {
  if (ready) return;
  ready = true;
  // Override iOS silent-mode switch so SFX always play.
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  try {
    spinPlayer = createAudioPlayer(SOURCES.spin);
    spinPlayer.loop = true;
  } catch {}
}

export function playSound(key: SoundKey): void {
  try {
    if (key === 'spin') {
      spinPlayer?.play();
      return;
    }
    // Fresh player each call → instant replay without seekTo.
    const p = createAudioPlayer(SOURCES[key]);
    p.play();
    setTimeout(() => { try { p.remove(); } catch {} }, 5000);
  } catch {}
}

export function stopSound(key: SoundKey): void {
  if (key === 'spin') {
    try { spinPlayer?.pause(); } catch {}
  }
}

export function disposeSounds(): void {
  try { spinPlayer?.remove(); } catch {}
  spinPlayer = null;
  ready = false;
}
