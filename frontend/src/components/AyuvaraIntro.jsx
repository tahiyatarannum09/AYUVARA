import { useState, useEffect } from 'react'
import AyuvaraLogo from './AyuvaraLogo'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function AyuvaraIntro({ onComplete }) {
  const [stage, setStage] = useState(0) // 0: start, 1: eye & legs, 2: capsule snap, 3: text, 4: exit

  useEffect(() => {
    // Stage 1: Eye drops & legs slide in
    const t1 = setTimeout(() => setStage(1), 100)
    // Stage 2: Capsule snaps in
    const t2 = setTimeout(() => setStage(2), 700)
    // Stage 3: Logo text glows
    const t3 = setTimeout(() => setStage(3), 1300)
    // Stage 4: Fade out intro
    const t4 = setTimeout(() => {
      setStage(4)
      setTimeout(onComplete, 500)
    }, 2400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1b2533] via-[#151c27] to-[#0d121a] text-white transition-opacity duration-500 cursor-pointer ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient 3D Glow Orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      {/* Assembly Stage Container */}
      <div className="relative flex flex-col items-center justify-center transform perspective-1000">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg
            viewBox="0 0 300 300"
            className="w-56 h-56 overflow-visible drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <defs>
              <linearGradient id="introLeftLeg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9a76" />
                <stop offset="50%" stopColor="#ff6584" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              <linearGradient id="introRightLeg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              <linearGradient id="introLensBezel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="40%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              <linearGradient id="introCapsuleCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <linearGradient id="introCapsulePeach" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>

              <linearGradient id="introGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* PART 1: LEFT LEG - Swoops in from bottom-left */}
            <g
              style={{
                transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: stage >= 1 ? 'translate(0, 0) scale(1)' : 'translate(-80px, 80px) scale(0.6)',
                opacity: stage >= 1 ? 1 : 0,
              }}
            >
              <path
                d="M 136,88 L 76,236 C 72,246 82,256 94,252 L 150,118 Z"
                fill="url(#introLeftLeg)"
              />
              <circle cx="85" cy="242" r="14" fill="#f43f5e" />
              <path d="M 132,96 L 82,232" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* PART 2: RIGHT LEG - Swoops in from bottom-right */}
            <g
              style={{
                transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: stage >= 1 ? 'translate(0, 0) scale(1)' : 'translate(80px, 80px) scale(0.6)',
                opacity: stage >= 1 ? 1 : 0,
              }}
            >
              <path
                d="M 164,88 L 224,236 C 228,246 218,256 206,252 L 150,118 Z"
                fill="url(#introRightLeg)"
              />
              <circle cx="215" cy="242" r="14" fill="#2563eb" />
              <path d="M 168,96 L 218,232" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* PART 3: CAPSULE CROSSBAR - Glides in and snaps with pulse */}
            <g
              style={{
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: stage >= 2 ? 'translate(0, 0) scale(1)' : 'translate(0, 40px) scale(0.3)',
                opacity: stage >= 2 ? 1 : 0,
              }}
            >
              <path
                d="M 112,142 L 150,142 L 150,174 L 112,174 A 16,16 0 0,1 96,158 A 16,16 0 0,1 112,142 Z"
                fill="url(#introCapsuleCyan)"
              />
              <path
                d="M 150,142 L 188,142 A 16,16 0 0,1 204,158 A 16,16 0 0,1 188,174 L 150,174 Z"
                fill="url(#introCapsulePeach)"
              />
              <line x1="150" y1="142" x2="150" y2="174" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
              <rect x="104" y="145" width="92" height="6" rx="3" fill="url(#introGloss)" />
            </g>

            {/* PART 4: TOP APEX CAMERA EYE - Drops from top with bounce */}
            <g
              style={{
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: stage >= 1 ? 'translate(0, 0) scale(1)' : 'translate(0, -90px) scale(0.4)',
                opacity: stage >= 1 ? 1 : 0,
              }}
            >
              <circle cx="150" cy="62" r="28" fill="url(#introLensBezel)" />
              <circle cx="150" cy="62" r="22" fill="#0f172a" />
              <circle cx="150" cy="62" r="16" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="150" cy="62" r="9" fill="#ff4d6d" />
              <circle cx="150" cy="62" r="4" fill="#ffffff" opacity="0.9" />
              <ellipse cx="142" cy="52" rx="6" ry="3.5" transform="rotate(-25 142 52)" fill="#ffffff" opacity="0.9" />
            </g>

            {/* Snap Ripple Effect */}
            {stage >= 2 && (
              <circle cx="150" cy="158" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7">
                <animate attributeName="r" values="20;75" dur="0.8s" fill="freeze" />
                <animate attributeName="opacity" values="0.8;0" dur="0.8s" fill="freeze" />
              </circle>
            )}
          </svg>
        </div>

        {/* Brand Name Text Assembly */}
        <div
          className="text-center transition-all duration-700 mt-2"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <h1 className="font-serif text-3xl md:text-4xl tracking-[0.45em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-amber-200 drop-shadow-md">
            AYUVARA
          </h1>
          <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-300/80 font-medium mt-1">
            Smart Autonomous ElderCare
          </p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onComplete(); }}
        className="absolute bottom-8 right-8 text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <span>Skip intro</span>
        <ArrowRight size={13} />
      </button>
    </div>
  )
}

