import React from 'react'

export default function AyuvaraLogo({ size = 'md', className = '', showText = true, animated = false }) {
  // Dimensions
  const dims = {
    sm: { w: 38, h: 38, textSize: 'text-xs', tracking: 'tracking-[0.25em]' },
    md: { w: 68, h: 68, textSize: 'text-base', tracking: 'tracking-[0.32em]' },
    lg: { w: 120, h: 120, textSize: 'text-2xl', tracking: 'tracking-[0.38em]' },
    xl: { w: 180, h: 180, textSize: 'text-4xl', tracking: 'tracking-[0.42em]' },
  }[size] || { w: 68, h: 68, textSize: 'text-base', tracking: 'tracking-[0.32em]' }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D SVG Symbol */}
      <svg
        viewBox="0 0 300 300"
        width={dims.w}
        height={dims.h}
        className="overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Left Leg Gradient: Peach-Orange to Neon Pink */}
          <linearGradient id="ayuvaraLeftLeg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9a76" />
            <stop offset="50%" stopColor="#ff6584" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          {/* Right Leg Gradient: Cyan to Cobalt Blue */}
          <linearGradient id="ayuvaraRightLeg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Camera Lens Outer Bezel Gradient */}
          <linearGradient id="ayuvaraLensBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="40%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          {/* Camera Iris Radial */}
          <radialGradient id="ayuvaraIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="35%" stopColor="#0f172a" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Capsule Cyan Side */}
          <linearGradient id="capsuleCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Capsule Peach Side */}
          <linearGradient id="capsulePeach" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>

          {/* 3D Specular Highlight */}
          <linearGradient id="glossStreak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="soft3dShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ── PIECE 1: LEFT LEG (Coral-Pink Tube) ── */}
        <g
          className={animated ? 'ayuvara-left-leg' : ''}
          filter="url(#soft3dShadow)"
        >
          {/* 3D Base Tube */}
          <path
            d="M 136,88 L 76,236 C 72,246 82,256 94,252 L 150,118 Z"
            fill="url(#ayuvaraLeftLeg)"
          />
          {/* Rounded bottom cap */}
          <circle cx="85" cy="242" r="14" fill="#f43f5e" />
          {/* Specular 3D Gloss Curve along left leg */}
          <path
            d="M 132,96 L 82,232"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* ── PIECE 2: RIGHT LEG (Cyan-Blue Tube) ── */}
        <g
          className={animated ? 'ayuvara-right-leg' : ''}
          filter="url(#soft3dShadow)"
        >
          {/* 3D Base Tube */}
          <path
            d="M 164,88 L 224,236 C 228,246 218,256 206,252 L 150,118 Z"
            fill="url(#ayuvaraRightLeg)"
          />
          {/* Rounded bottom cap */}
          <circle cx="215" cy="242" r="14" fill="#2563eb" />
          {/* Specular 3D Gloss Curve along right leg */}
          <path
            d="M 168,96 L 218,232"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* ── PIECE 3: 3D CAPSULE CROSSBAR (Cyan + Peach) ── */}
        <g
          className={animated ? 'ayuvara-capsule' : ''}
          filter="url(#soft3dShadow)"
        >
          {/* Capsule Background Pill Container */}
          <g>
            {/* Left Cyan Half */}
            <path
              d="M 112,142 L 150,142 L 150,174 L 112,174 A 16,16 0 0,1 96,158 A 16,16 0 0,1 112,142 Z"
              fill="url(#capsuleCyan)"
            />
            {/* Right Peach Half */}
            <path
              d="M 150,142 L 188,142 A 16,16 0 0,1 204,158 A 16,16 0 0,1 188,174 L 150,174 Z"
              fill="url(#capsulePeach)"
            />
            {/* Center Seam Joint */}
            <line x1="150" y1="142" x2="150" y2="174" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
            {/* Top 3D Specular Highlight Strip */}
            <rect
              x="104"
              y="145"
              width="92"
              height="6"
              rx="3"
              fill="url(#glossStreak)"
            />
          </g>
        </g>

        {/* ── PIECE 4: TOP APEX CAMERA LENS (Eye / Sensor) ── */}
        <g
          className={animated ? 'ayuvara-eye' : ''}
          filter="url(#soft3dShadow)"
        >
          {/* Outer Metallic Bezel Ring */}
          <circle cx="150" cy="62" r="28" fill="url(#ayuvaraLensBezel)" />
          {/* Dark Inner Chamber */}
          <circle cx="150" cy="62" r="22" fill="#0f172a" />
          {/* Cyan Aperture Ring */}
          <circle cx="150" cy="62" r="16" fill="none" stroke="#38bdf8" strokeWidth="3" />
          {/* Center Glowing Pink Iris / Sensor */}
          <circle cx="150" cy="62" r="9" fill="#ff4d6d" />
          <circle cx="150" cy="62" r="4" fill="#ffffff" opacity="0.8" />
          {/* Lens Specular Glint */}
          <ellipse
            cx="142"
            cy="52"
            rx="6"
            ry="3.5"
            transform="rotate(-25 142 52)"
            fill="#ffffff"
            opacity="0.85"
          />
        </g>
      </svg>

      {/* Typography: A Y U V A R A */}
      {showText && (
        <div className={`mt-2 font-serif text-center uppercase ${dims.textSize} ${dims.tracking} font-extrabold text-[#1e3a5f] select-none transition-all duration-500`}>
          A Y U V A R A
        </div>
      )}
    </div>
  )
}

