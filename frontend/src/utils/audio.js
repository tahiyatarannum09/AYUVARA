/**
 * AYUVARA Sound Engine - Web Audio API Synthetic Chimes
 * Zero external audio files required, 100% reliable, zero network latency.
 */

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * High-tech cinematic harmonic chime when the 3D AYUVARA logo assembles
 */
export function playLogoChime() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Harmonic notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 1.2 },
      { freq: 659.25, time: 0.15, dur: 1.1 },
      { freq: 783.99, time: 0.30, dur: 1.0 },
      { freq: 1046.50, time: 0.45, dur: 1.4 }
    ]

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + time)
      
      // Soft swell and long bell decay
      gain.gain.setValueAtTime(0, now + time)
      gain.gain.linearRampToValueAtTime(0.12, now + time + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + time)
      osc.stop(now + time + dur)
    })
  } catch (e) {
    // Graceful fallback if audio context blocked by browser autoplay policy
  }
}

/**
 * Mechanical snap sound when the 3D capsule clicks into place
 */
export function playCapsuleSnap() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.18)
  } catch (e) {}
}

/**
 * Gentle senior-friendly medication reminder chime
 */
export function playMedicationReminder() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const melody = [
      { freq: 587.33, time: 0.0, dur: 0.35 }, // D5
      { freq: 739.99, time: 0.2, dur: 0.45 }, // F#5
      { freq: 880.00, time: 0.4, dur: 0.70 }  // A5
    ]

    melody.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0, now + time)
      gain.gain.linearRampToValueAtTime(0.15, now + time + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + time)
      osc.stop(now + time + dur)
    })
  } catch (e) {}
}

/**
 * Positive confirmation chime when a medication dose is confirmed
 */
export function playTakeDoseSuccess() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const tones = [
      { freq: 523.25, time: 0.0, dur: 0.25 }, // C5
      { freq: 659.25, time: 0.1, dur: 0.45 }, // E5
      { freq: 1046.50, time: 0.22, dur: 0.6 } // C6
    ]

    tones.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0, now + time)
      gain.gain.linearRampToValueAtTime(0.18, now + time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + time)
      osc.stop(now + time + dur)
    })
  } catch (e) {}
}

