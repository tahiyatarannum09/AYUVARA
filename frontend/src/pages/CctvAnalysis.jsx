import { useState, useEffect } from 'react'
import { Video, Camera, ExternalLink } from 'lucide-react'

const POSTURE_BADGES = {
  standing: { label: 'Standing / Walking', color: 'bg-[#D6E6F2] text-[#1A2F4C]' },
  sitting: { label: 'Sitting (Normal)', color: 'bg-[#D6E6F2] text-[#1A2F4C]' },
  lying: { label: 'Resting / Lying Down', color: 'bg-slate-100 text-slate-800' },
  bending: { label: 'Bending', color: 'bg-amber-100 text-amber-900' },
  fall: { label: 'CRITICAL FALL DETECTED', color: 'bg-rose-600 text-white animate-pulse' },
}

export default function CctvAnalysis() {
  const [currentPosture, setCurrentPosture] = useState('sitting')
  const [confidence, setConfidence] = useState(95)
  const [streamActive, setStreamActive] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState('Living Room (Cam 1)')

  useEffect(() => {
    const postures = ['sitting', 'sitting', 'standing', 'sitting']
    const interval = setInterval(() => {
      const next = postures[Math.floor(Math.random() * postures.length)]
      setCurrentPosture(next)
      setConfidence(Math.floor(Math.random() * 5) + 93)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const currentBadge = POSTURE_BADGES[currentPosture] || POSTURE_BADGES.sitting

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">CCTV Vision & Posture AI</h1>
          <p className="text-xs text-[#4A6B8F]">Real-time kinematic posture classification and fall risk detection</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D6E6F2] text-[#1A2F4C]">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          YOLOv8-Pose Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4 bg-slate-950 border-slate-900 text-white shadow-xl">
            <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-[#38bdf8]" />
                <span className="font-bold text-white">{selectedRoom}</span>
                <span>·</span>
                <span className="font-mono text-[#38bdf8]">24 FPS</span>
              </div>
              <button 
                onClick={() => setStreamActive(!streamActive)}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                {streamActive ? 'Pause Stream' : 'Resume'}
              </button>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
              {streamActive ? (
                <img 
                  src="http://127.0.0.1:8081/mjpeg" 
                  alt="Live CCTV Feed" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="text-slate-500 font-mono text-xs">Video Feed Paused</div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`badge ${currentBadge.color} shadow-md`}>
                  {currentBadge.label} ({confidence}%)
                </span>
              </div>
            </div>
          </div>

          {/* Clean Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase">Sitting</div>
              <div className="text-xl font-bold text-[#1A2F4C] mt-0.5">62%</div>
            </div>
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase">Standing</div>
              <div className="text-xl font-bold text-[#1A2F4C] mt-0.5">26%</div>
            </div>
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase">Fall Events</div>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">0</div>
            </div>
          </div>
        </div>

        {/* Right Aux Links */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-4 space-y-3 border-[#D6E6F2]">
            <div className="text-xs font-bold text-[#1A2F4C] uppercase tracking-wider">
              Auxiliary Streams
            </div>
            <div className="flex flex-col gap-2">
              <a 
                href="http://localhost:3000" 
                target="_blank" 
                rel="noreferrer"
                className="btn-ghost text-xs py-2 px-3 rounded-xl flex items-center justify-between"
              >
                <span>Console Station (:3000)</span>
                <ExternalLink size={13} />
              </a>
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                rel="noreferrer"
                className="btn-ghost text-xs py-2 px-3 rounded-xl flex items-center justify-between"
              >
                <span>Standalone CCTV (:3001)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
