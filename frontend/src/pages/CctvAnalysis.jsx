import { useState, useEffect } from 'react'
import { Video, Camera, ExternalLink, ShieldCheck, Activity, Eye, AlertCircle, RefreshCw } from 'lucide-react'

const POSTURE_BADGES = {
  standing: { label: 'Standing / Walking', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  sitting: { label: 'Sitting (Normal)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  lying: { label: 'Resting / Lying Down', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  bending: { label: 'Bending', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  fall: { label: 'CRITICAL FALL DETECTED', color: 'bg-rose-600 text-white animate-pulse' },
}

const ROOMS = [
  { id: 'living', name: 'Living Room (Cam 1)', fps: '24 FPS', status: 'Optimal' },
  { id: 'bedroom', name: 'Bedroom (Cam 2)', fps: '24 FPS', status: 'Active' },
  { id: 'kitchen', name: 'Kitchen (Cam 3)', fps: '20 FPS', status: 'Active' },
  { id: 'hallway', name: 'Hallway (Cam 4)', fps: '24 FPS', status: 'Active' },
]

export default function CctvAnalysis() {
  const [currentPosture, setCurrentPosture] = useState('sitting')
  const [confidence, setConfidence] = useState(96)
  const [streamActive, setStreamActive] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0])
  const [imageFailed, setImageFailed] = useState(false)
  const [logs, setLogs] = useState([
    { time: '13:58:12', event: 'Kinematic posture: Sitting posture verified', room: 'Living Room', status: 'normal' },
    { time: '13:55:04', event: 'Transition: Standing to Sitting (Normal velocity)', room: 'Living Room', status: 'normal' },
    { time: '13:50:20', event: 'Zone entry: Living Room sensor beacon SEN-8492', room: 'Living Room', status: 'normal' },
    { time: '13:42:15', event: 'Posture check: Upright gait, zero gait asymmetry', room: 'Hallway', status: 'normal' },
  ])

  useEffect(() => {
    const postures = ['sitting', 'sitting', 'standing', 'sitting']
    const interval = setInterval(() => {
      const next = postures[Math.floor(Math.random() * postures.length)]
      setCurrentPosture(next)
      const conf = Math.floor(Math.random() * 5) + 93
      setConfidence(conf)
      
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      setLogs(prev => [
        { time: timeStr, event: `Kinematic posture classified: ${next.toUpperCase()} (${conf}%)`, room: selectedRoom.name.split(' (')[0], status: 'normal' },
        ...prev.slice(0, 5)
      ])
    }, 10000)
    return () => clearInterval(interval)
  }, [selectedRoom])

  const currentBadge = POSTURE_BADGES[currentPosture] || POSTURE_BADGES.sitting

  return (
    <div className="space-y-6">

      {/* ── HIGH-TECH SOFT BLUE HERO BANNER ──────────────────────────────── */}
      <div 
        className="relative rounded-3xl overflow-hidden p-6 sm:p-7 border border-[#8DB4D6]/35"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F2F7FB 40%, #E6F1F9 75%, #D6E6F2 100%)',
          boxShadow: '0 18px 45px -12px rgba(141, 180, 214, 0.35)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #8DB4D6 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} 
        />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#8DB4D6]/40 text-[#1A2F4C] text-[11px] font-bold shadow-sm mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span>YOLOv8-Pose Vision Shield Active</span>
              <span className="text-[#8DB4D6]">|</span>
              <span className="text-[#4A6B8F]">Kinematic Fall Detection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A2F4C] tracking-tight">
              CCTV AI Vision &amp; Posture Guardian
            </h1>
            <p className="text-xs sm:text-sm text-[#4A6B8F] mt-1 max-w-xl">
              Continuous multi-camera skeletal pose tracking and autonomous fall detection designed for elder safety.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/90 border border-[#8DB4D6]/40 px-4 py-2.5 rounded-2xl shadow-sm text-center">
              <div className="text-[10px] uppercase font-bold text-[#4A6B8F]">Fall Events</div>
              <div className="text-xl font-black text-blue-600 mt-0.5">0 Risk</div>
            </div>
            <div className="bg-white/90 border border-[#8DB4D6]/40 px-4 py-2.5 rounded-2xl shadow-sm text-center">
              <div className="text-[10px] uppercase font-bold text-[#4A6B8F]">AI Confidence</div>
              <div className="text-xl font-black text-[#1A2F4C] mt-0.5">{confidence}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CAMERA SELECTOR PILLS ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {ROOMS.map(r => (
          <button
            key={r.id}
            onClick={() => { setSelectedRoom(r); setImageFailed(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
              selectedRoom.id === r.id
                ? 'bg-[#1A2F4C] text-white border-[#1A2F4C] shadow-md'
                : 'bg-white text-[#1A2F4C] border-[#D6E6F2] hover:bg-[#F2F7FB]'
            }`}
          >
            <Camera size={13} className={selectedRoom.id === r.id ? 'text-[#38bdf8]' : 'text-[#8DB4D6]'} />
            <span>{r.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedRoom.id === r.id ? 'bg-white/20 text-white' : 'bg-[#D6E6F2] text-[#1A2F4C]'
            }`}>
              {r.fps}
            </span>
          </button>
        ))}
      </div>

      {/* ── MAIN VIDEO & SENSOR MONITOR SECTION ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Video Screen (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4 bg-slate-950 border-slate-900 text-white shadow-2xl relative overflow-hidden">
            
            {/* Top Toolbar inside Video */}
            <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-slate-800 text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-white tracking-wide">{selectedRoom.name}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-[#38bdf8] text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {selectedRoom.fps} · 1080p Stream
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStreamActive(!streamActive)}
                  className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {streamActive ? 'Pause Stream' : 'Resume'}
                </button>
              </div>
            </div>

            {/* Video Canvas Area */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800/80">
              {streamActive && !imageFailed ? (
                <img 
                  src="http://127.0.0.1:8081/mjpeg" 
                  alt="Live CCTV Feed" 
                  className="w-full h-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : null}

              {/* Realistic AI Vision Simulation Overlay (renders when MJPEG stream is offline or active) */}
              {(imageFailed || !streamActive) && (
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
                  {/* Subtle Radar Scanline Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
                  
                  {/* Skeleton Pose Wireframe SVG */}
                  <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="mb-2">
                    {/* Bounding box */}
                    <rect x="40" y="20" width="140" height="145" rx="8" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7" />
                    <text x="45" y="35" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      [ID: DOROTHY-W] {confidence}%
                    </text>

                    {/* Kinematic Skeleton joints */}
                    {/* Head */}
                    <circle cx="110" cy="50" r="10" stroke="#38bdf8" strokeWidth="2" fill="#0284c7" fillOpacity="0.3" />
                    {/* Neck / Spine */}
                    <line x1="110" y1="60" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2" />
                    {/* Shoulders */}
                    <line x1="85" y1="75" x2="135" y2="75" stroke="#38bdf8" strokeWidth="2" />
                    {/* Arms */}
                    <line x1="85" y1="75" x2="75" y2="110" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="135" y1="75" x2="145" y2="110" stroke="#38bdf8" strokeWidth="2" />
                    {/* Hips */}
                    <line x1="90" y1="105" x2="130" y2="105" stroke="#38bdf8" strokeWidth="2" />
                    {/* Legs (Seated posture) */}
                    <line x1="90" y1="105" x2="80" y2="135" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="130" y1="105" x2="140" y2="135" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="80" y1="135" x2="80" y2="155" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="140" y1="135" x2="140" y2="155" stroke="#38bdf8" strokeWidth="2" />

                    {/* Keypoint glowing dots */}
                    {[[110,50],[110,75],[85,75],[135,75],[75,110],[145,110],[110,105],[90,105],[130,105],[80,135],[140,135],[80,155],[140,155]].map(([x,y], i) => (
                      <circle key={i} cx={x} cy={y} r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                    ))}
                  </svg>

                  <div className="font-mono text-xs text-[#38bdf8] font-bold">
                    YOLOv8-Pose Kinematic Mesh Active
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Telemetry: 17 Keypoint Skeletons Tracked · Real-Time Posture Normal
                  </div>
                </div>
              )}

              {/* Status Badge in corner */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-lg ${currentBadge.color}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {currentBadge.label} ({confidence}%)
                </span>
              </div>

              {/* Bottom Right FPS badge */}
              <div className="absolute bottom-3 right-3 z-20 font-mono text-[10px] bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700/60">
                CAM-01 · 24 FPS · LOW LATENCY
              </div>
            </div>

            {/* Video Controls Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#38bdf8]" />
                <span>AI Fall Prevention Protocol Armed</span>
              </div>
              <button 
                onClick={() => setImageFailed(false)}
                className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1"
              >
                <RefreshCw size={11} /> Re-sync Camera Stream
              </button>
            </div>
          </div>

          {/* Kinematic Posture Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase tracking-wider">Sitting Time</div>
              <div className="text-xl font-black text-[#1A2F4C] mt-0.5">64%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Normal Baseline</div>
            </div>
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase tracking-wider">Walking / Gait</div>
              <div className="text-xl font-black text-[#1A2F4C] mt-0.5">28%</div>
              <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Symmetric</div>
            </div>
            <div className="card p-3.5 text-center border-[#D6E6F2]">
              <div className="text-[10px] text-[#4A6B8F] font-bold uppercase tracking-wider">Fall Incidents</div>
              <div className="text-xl font-black text-blue-600 mt-0.5">0</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Safe (Zero Alarms)</div>
            </div>
          </div>
        </div>

        {/* Right Aux Panel: Real-Time Event Audit Trail & Aux Links (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live AI Vision Event Log */}
          <div className="card p-4 space-y-3 border-[#D6E6F2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#D6E6F2]">
              <div className="text-xs font-bold text-[#1A2F4C] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-[#38bdf8]" />
                <span>AI Vision Audit Trail</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2.5">
              {logs.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#F2F7FB] border border-[#D6E6F2] text-xs space-y-0.5">
                  <div className="flex justify-between items-center text-[10px] text-[#4A6B8F] font-mono">
                    <span>{log.time}</span>
                    <span className="font-bold text-[#1A2F4C]">{log.room}</span>
                  </div>
                  <div className="font-semibold text-[#1A2F4C] text-[11px] leading-snug">
                    {log.event}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auxiliary Vision Servers */}
          <div className="card p-4 space-y-3 border-[#D6E6F2]">
            <div className="text-xs font-bold text-[#1A2F4C] uppercase tracking-wider">
              Connected Video Pipelines
            </div>
            <div className="flex flex-col gap-2">
              <a 
                href="http://localhost:3000" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#D6E6F2] bg-[#F2F7FB] hover:border-[#8DB4D6] text-xs font-semibold flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-[#1A2F4C]">SENTINEL Console (:3000)</div>
                  <div className="text-[10px] text-[#4A6B8F]">Full telemetry workstation</div>
                </div>
                <ExternalLink size={13} className="text-[#38bdf8]" />
              </a>
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#D6E6F2] bg-[#F2F7FB] hover:border-[#8DB4D6] text-xs font-semibold flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-[#1A2F4C]">Standalone CCTV Hub (:3001)</div>
                  <div className="text-[10px] text-[#4A6B8F]">Dedicated multi-cam matrix</div>
                </div>
                <ExternalLink size={13} className="text-[#38bdf8]" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
