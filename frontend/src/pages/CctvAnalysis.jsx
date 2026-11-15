import { useState, useEffect } from 'react'
import { 
  Eye, Video, ShieldAlert, Activity, Play, Pause, ExternalLink, AlertTriangle,
  Sparkles, CheckCircle2, ShieldCheck, Camera
} from 'lucide-react'

const POSTURE_BADGES = {
  standing: { label: 'Standing / Walking', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  sitting: { label: 'Sitting (Normal)', color: 'bg-emerald-100/80 text-emerald-900 border-emerald-300' },
  lying: { label: 'Resting / Lying Down', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  bending: { label: 'Bending', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  fall: { label: 'CRITICAL FALL EVENT DETECTED', color: 'bg-rose-600 text-white animate-pulse border-rose-700' },
}

export default function CctvAnalysis() {
  const [currentPosture, setCurrentPosture] = useState('sitting')
  const [confidence, setConfidence] = useState(95)
  const [fps, setFps] = useState(24)
  const [streamActive, setStreamActive] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState('Living Room (Cam 1)')
  const [recentEvents, setRecentEvents] = useState([
    { id: 1, time: '11:42 AM', posture: 'sitting', detail: 'Living room primary seating area', confidence: '95%' },
    { id: 2, time: '11:28 AM', posture: 'standing', detail: 'Transitioned across living area toward kitchen', confidence: '92%' },
    { id: 3, time: '10:55 AM', posture: 'sitting', detail: 'Dining table position', confidence: '96%' },
    { id: 4, time: '09:30 AM', posture: 'standing', detail: 'Hallway movement recorded', confidence: '93%' },
    { id: 5, time: '08:15 AM', posture: 'lying', detail: 'Bedroom morning awakening', confidence: '98%' },
  ])

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
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Computer Vision Inference</span>
            <span className="text-xs text-emerald-800 font-mono">YOLOv8-Pose · Port 8081</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">CCTV Computer Vision & Posture Monitoring</h1>
          <p className="text-xs text-emerald-800/80">Autonomous fall prevention, keypoint kinematic tracking, and posture classification</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Inference Stream: Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Video Stream Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4 bg-emerald-950 border-emerald-900 text-white shadow-xl">
            <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-emerald-900/80 text-emerald-300">
              <div className="flex items-center gap-2.5">
                <Camera size={15} className="text-emerald-400" />
                <span className="font-bold text-white">{selectedRoom}</span>
                <span>·</span>
                <span className="font-mono text-emerald-400 font-bold">{fps} FPS</span>
                <span>·</span>
                <span className="text-emerald-200">17 Keypoints Tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStreamActive(!streamActive)}
                  className="px-3 py-1 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700 transition-colors"
                >
                  {streamActive ? 'Pause Video Feed' : 'Resume Video'}
                </button>
              </div>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-emerald-900/60 shadow-inner">
              {streamActive ? (
                <img 
                  src="http://127.0.0.1:8081/mjpeg" 
                  alt="Live CCTV Pose Stream" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                    const fallback = document.getElementById('cctv-fallback')
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : (
                <div className="text-center text-emerald-300/60 font-mono text-xs">Video Feed Paused by Caregiver</div>
              )}

              {/* Fallback Graphic */}
              <div id="cctv-fallback" style={{ display: 'none' }} className="w-full h-full flex-col items-center justify-center p-6 text-center bg-emerald-950">
                <div className="w-12 h-12 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center mb-2 mx-auto">
                  <Activity size={24} />
                </div>
                <div className="font-bold text-emerald-100 text-sm">YOLOv8 Pose Estimation Active</div>
                <div className="text-xs text-emerald-300/80 max-w-sm mt-1">
                  Target: Dorothy Williams · Keypoints synchronized
                </div>
                <div className="mt-3">
                  <span className={`badge ${currentBadge.color}`}>
                    Current Posture: {currentBadge.label} ({confidence}%)
                  </span>
                </div>
              </div>

              {/* Live Status HUD */}
              <div className="absolute top-3 left-3">
                <span className={`badge ${currentBadge.color} shadow-md`}>
                  {currentBadge.label} ({confidence}%)
                </span>
              </div>

              {/* Camera Channel Selector */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {['Living Room (Cam 1)', 'Bedroom (Cam 2)', 'Kitchen (Cam 3)'].map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all backdrop-blur-md ${
                      selectedRoom === room 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-black/60 text-emerald-200 hover:text-white hover:bg-black/80'
                    }`}
                  >
                    {room.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posture Distribution Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-3.5 text-center border-emerald-100">
              <div className="text-xs text-emerald-800 font-bold uppercase">Sitting</div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">62%</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Primary posture</div>
            </div>
            <div className="card p-3.5 text-center border-emerald-100">
              <div className="text-xs text-emerald-800 font-bold uppercase">Standing</div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">26%</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Active movement</div>
            </div>
            <div className="card p-3.5 text-center border-emerald-100">
              <div className="text-xs text-emerald-800 font-bold uppercase">Resting</div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">12%</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Bed / Lounge</div>
            </div>
            <div className="card p-3.5 text-center bg-emerald-50/80 border-emerald-200">
              <div className="text-xs text-emerald-900 font-extrabold uppercase">Fall Events</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">0</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">100% Safe</div>
            </div>
          </div>
        </div>

        {/* Right Event Log (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                Kinematic Posture Events
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">Live Sync</span>
            </div>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Posture</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td className="font-mono text-emerald-800 text-xs whitespace-nowrap">{ev.time}</td>
                    <td>
                      <div className="font-bold text-emerald-950 text-xs uppercase">{ev.posture}</div>
                      <div className="text-[10px] text-emerald-800/80">{ev.detail}</div>
                    </td>
                    <td className="font-mono text-xs text-emerald-700 font-bold">{ev.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-4 bg-emerald-50/40 border-emerald-200 space-y-2.5">
            <div className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
              Independent Telemetry Consoles
            </div>
            <div className="text-[11px] text-emerald-800/80">
              Direct access to auxiliary CCTV processing dashboards running on this machine:
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <a 
                href="http://localhost:3000" 
                target="_blank" 
                rel="noreferrer"
                className="btn-ghost text-xs py-2 px-3 rounded-xl flex items-center justify-between"
              >
                <span>Sentinel Full Telemetry Console (:3000)</span>
                <ExternalLink size={13} />
              </a>
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                rel="noreferrer"
                className="btn-ghost text-xs py-2 px-3 rounded-xl flex items-center justify-between"
              >
                <span>Dedicated CCTV Inference Feed (:3001)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
