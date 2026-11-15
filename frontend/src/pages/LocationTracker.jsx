import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context'
import { 
  Compass, Radio, Thermometer, Wind, Lightbulb, Lock, Video, 
  ShieldCheck, Eye, Layers, Sparkles, Navigation, Activity, CheckCircle2,
  Maximize2
} from 'lucide-react'

// Isometric Room Geometry definitions (isometric 30-degree coordinate projection)
const ROOM_CONFIG = [
  {
    id: 'Bedroom',
    label: 'Master Bedroom',
    type: 'carpet',
    color: '#064e3b',
    icon: '🛏️',
    coords: 'M 140,80 L 260,145 L 140,210 L 20,145 Z',
    center: { x: 140, y: 145 },
  },
  {
    id: 'Bathroom',
    label: 'En-Suite Bathroom',
    type: 'tile',
    color: '#047857',
    icon: '🚿',
    coords: 'M 260,145 L 340,188 L 260,230 L 180,188 Z',
    center: { x: 260, y: 188 },
  },
  {
    id: 'Study',
    label: 'Study & Library',
    type: 'wood',
    color: '#065f46',
    icon: '📚',
    coords: 'M 340,188 L 460,252 L 380,295 L 260,230 Z',
    center: { x: 360, y: 240 },
  },
  {
    id: 'Living Room',
    label: 'Living Room',
    type: 'wood',
    color: '#10b981',
    icon: '🛋️',
    coords: 'M 140,210 L 300,295 L 180,360 L 20,275 Z',
    center: { x: 160, y: 285 },
  },
  {
    id: 'Hallway',
    label: 'Central Hallway',
    type: 'slate',
    color: '#059669',
    icon: '🚪',
    coords: 'M 260,230 L 380,295 L 300,338 L 180,273 Z',
    center: { x: 280, y: 284 },
  },
  {
    id: 'Kitchen',
    label: 'Modern Kitchen',
    type: 'marble',
    color: '#34d399',
    icon: '🍳',
    coords: 'M 300,295 L 460,380 L 340,445 L 180,360 Z',
    center: { x: 320, y: 370 },
  }
]

function IsometricResidence({ currentRoom, onSelectRoom, viewMode }) {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-950/5 via-white to-emerald-50/30 rounded-2xl border border-emerald-900/10 p-4 shadow-inner">
      {/* 3D Viewport Matrix Canvas */}
      <svg
        viewBox="0 0 500 480"
        className="w-full h-auto drop-shadow-2xl transition-all duration-700 ease-out select-none"
        style={{
          transform: viewMode === 'cinematic' 
            ? 'scale(1.08) translateY(-10px)' 
            : viewMode === '2d' 
              ? 'scale(0.95)' 
              : 'scale(1)'
        }}
      >
        <defs>
          {/* Floor Texture Gradients */}
          <linearGradient id="woodFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="50%" stopColor="#f7f2ea" />
            <stop offset="100%" stopColor="#ede4d6" />
          </linearGradient>

          <linearGradient id="carpetFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>

          <linearGradient id="marbleFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <linearGradient id="tileFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="wallGradientLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="wallGradientRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
          </linearGradient>

          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#064e3b" floodOpacity="0.18" />
          </filter>

          <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer 3D Foundation Slab Extrusion */}
        <g id="foundation" opacity="0.95">
          <path
            d="M 20,175 L 140,110 L 460,282 L 340,475 L 180,390 L 20,305 Z"
            fill="#064e3b"
            opacity="0.08"
            transform="translate(0, 16)"
          />
          <path
            d="M 20,275 L 180,360 L 180,372 L 20,287 Z"
            fill="#64748b"
          />
          <path
            d="M 180,360 L 340,445 L 340,457 L 180,372 Z"
            fill="#475569"
          />
          <path
            d="M 340,445 L 460,380 L 460,392 L 340,457 Z"
            fill="#334155"
          />
        </g>

        {/* 3D Extruded Rear Walls */}
        <g id="rear-walls">
          <path
            d="M 20,145 L 140,80 L 140,45 L 20,110 Z"
            fill="url(#wallGradientLeft)"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />
          <path
            d="M 140,80 L 460,252 L 460,217 L 140,45 Z"
            fill="url(#wallGradientRight)"
            stroke="#64748b"
            strokeWidth="0.8"
          />
          <path
            d="M 260,145 L 260,120 L 140,55 L 140,80 Z"
            fill="#e2e8f0"
            opacity="0.85"
          />
        </g>

        {/* Isometric Room Slabs */}
        {ROOM_CONFIG.map(room => {
          const isActive = room.id === currentRoom
          let floorFill = 'url(#woodFloor)'
          if (room.type === 'carpet') floorFill = 'url(#carpetFloor)'
          if (room.type === 'tile') floorFill = 'url(#tileFloor)'
          if (room.type === 'marble') floorFill = 'url(#marbleFloor)'

          return (
            <g
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className="cursor-pointer group"
              style={{ transition: 'all 0.3s ease' }}
            >
              {/* Floor polygon */}
              <path
                d={room.coords}
                fill={isActive ? 'url(#activeGlow)' : floorFill}
                stroke={isActive ? '#10b981' : '#cbd5e1'}
                strokeWidth={isActive ? '2.5' : '1'}
                className="transition-all duration-300 group-hover:opacity-90"
                style={{
                  filter: isActive ? 'url(#shadow3d)' : 'none'
                }}
              />

              {/* Floor grid accents for 3D realism */}
              <path
                d={room.coords}
                fill="none"
                stroke={isActive ? '#059669' : '#000000'}
                strokeWidth="0.5"
                strokeOpacity={isActive ? '0.35' : '0.04'}
                strokeDasharray="4 4"
              />

              {/* 3D Furniture Detail */}
              {room.id === 'Bedroom' && (
                <g id="bedroom-furniture" opacity="0.9">
                  <path d="M 85,120 L 135,148 L 105,165 L 55,137 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
                  <path d="M 85,116 L 135,144 L 105,161 L 55,133 Z" fill="#047857" opacity="0.8" />
                  <ellipse cx="78" cy="126" rx="9" ry="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
                  <ellipse cx="98" cy="137" rx="9" ry="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
                  <path d="M 138,150 L 152,158 L 142,164 L 128,156 Z" fill="#d97706" opacity="0.7" />
                  <circle cx="140" cy="154" r="2.5" fill="#fef08a" />
                </g>
              )}

              {room.id === 'Living Room' && (
                <g id="living-furniture" opacity="0.95">
                  <path d="M 100,245 L 145,270 L 130,280 L 85,255 Z" fill="#064e3b" stroke="#047857" strokeWidth="0.8" />
                  <path d="M 145,270 L 175,287 L 165,295 L 130,280 Z" fill="#065f46" stroke="#047857" strokeWidth="0.8" />
                  <path d="M 160,265 L 185,280 L 170,290 L 145,275 Z" fill="#b45309" opacity="0.8" />
                  <circle cx="166" cy="276" r="2" fill="#ffffff" />
                  <path d="M 50,250 L 80,267 L 72,272 L 42,255 Z" fill="#334155" />
                  <line x1="90" y1="230" x2="90" y2="245" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="90" cy="228" r="4" fill="#fde047" opacity="0.9" />
                </g>
              )}

              {room.id === 'Kitchen' && (
                <g id="kitchen-furniture" opacity="0.9">
                  <path d="M 280,340 L 350,380 L 330,395 L 260,355 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                  <path d="M 280,340 L 280,350 L 260,365 L 260,355 Z" fill="#cbd5e1" />
                  <path d="M 350,380 L 350,390 L 330,405 L 330,395 Z" fill="#94a3b8" />
                  <circle cx="295" cy="355" r="2" fill="#ef4444" />
                  <circle cx="315" cy="367" r="2" fill="#ef4444" />
                  <rect x="325" y="375" width="10" height="7" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                </g>
              )}

              {room.id === 'Bathroom' && (
                <g id="bathroom-furniture" opacity="0.9">
                  <ellipse cx="255" cy="180" rx="16" ry="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                  <ellipse cx="255" cy="180" rx="13" ry="8" fill="#e0f2fe" opacity="0.8" />
                  <line x1="230" y1="185" x2="245" y2="194" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}

              {room.id === 'Study' && (
                <g id="study-furniture" opacity="0.9">
                  <path d="M 340,225 L 390,252 L 375,262 L 325,235 Z" fill="#92400e" opacity="0.85" stroke="#78350f" strokeWidth="0.8" />
                  <rect x="350" y="235" width="8" height="6" rx="0.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.5" />
                  <ellipse cx="340" cy="245" rx="6" ry="4" fill="#1e293b" />
                </g>
              )}

              {/* Room Label Chip */}
              <g transform={`translate(${room.center.x}, ${room.center.y})`}>
                <rect
                  x="-42"
                  y="-11"
                  width="84"
                  height="22"
                  rx="11"
                  fill={isActive ? '#064e3b' : '#ffffff'}
                  stroke={isActive ? '#10b981' : '#e2e8f0'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  className="shadow-md transition-all duration-300"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  fill={isActive ? '#ffffff' : '#1e293b'}
                  fontSize="9.5"
                  fontWeight={isActive ? '700' : '600'}
                  className="pointer-events-none"
                >
                  {room.label}
                </text>
              </g>

              {/* ACTIVE ZONE 3D HOLOGRAPHIC BEACON & RADAR PULSE */}
              {isActive && (
                <g transform={`translate(${room.center.x}, ${room.center.y})`} className="pointer-events-none">
                  {/* Floor 3D Radar Wave 1 */}
                  <ellipse
                    cx="0"
                    cy="2"
                    rx="32"
                    ry="18"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.8"
                  >
                    <animate attributeName="rx" values="12;40;12" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="6;22;6" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.4s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Floor 3D Radar Wave 2 */}
                  <ellipse
                    cx="0"
                    cy="2"
                    rx="20"
                    ry="11"
                    fill="#10b981"
                    opacity="0.25"
                  >
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.8s" repeatCount="indefinite" />
                  </ellipse>

                  {/* 3D Vertical Floating Stalk */}
                  <line
                    x1="0"
                    y1="2"
                    x2="0"
                    y2="-34"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                    opacity="0.85"
                  />

                  {/* Levitating 3D Patient Avatar Badge */}
                  <g transform="translate(0, -38)">
                    <circle cx="0" cy="0" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="2.5" filter="url(#beaconGlow)">
                      <animate attributeName="cy" values="0;-5;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      DW
                    </text>
                    <circle cx="10" cy="-8" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.2">
                      <animate attributeName="r" values="3.5;5;3.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Floating 3D HUD Badge on the floor plan */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-900/10 shadow-sm flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <div>
          <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Spatial Telemetry</div>
          <div className="text-xs font-bold text-emerald-950">Dorothy Williams · {currentRoom}</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-900/10 text-[10px] text-emerald-900 font-mono shadow-sm">
        ISOMETRIC 30° PROJECTION · 6 ACTIVE SENSORS
      </div>
    </div>
  )
}

export default function LocationTracker() {
  const { patientId } = useApp()
  const [currentRoom, setCurrentRoom] = useState('Living Room')
  const [minutesAgo, setMinutesAgo] = useState(0)
  const [history, setHistory] = useState([])
  const [heatmap, setHeatmap] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('isometric') // isometric | cinematic | 2d
  const [showCamera, setShowCamera] = useState(false)
  const [roomDevices, setRoomDevices] = useState({
    lights: true,
    humidifier: true,
    doorLocked: true,
    temperature: 22,
    airQuality: '42 AQI (Clean)',
    soundDb: 34
  })

  const loadAll = useCallback(async () => {
    try {
      const [cur, hist, heat, alrt] = await Promise.all([
        fetch(`/api/location/${patientId}/current`).then(r => r.json()),
        fetch(`/api/location/${patientId}/history?limit=30`).then(r => r.json()),
        fetch(`/api/location/${patientId}/heatmap`).then(r => r.json()),
        fetch(`/api/location/${patientId}/alerts`).then(r => r.json()),
      ])
      setCurrentRoom(cur.room || 'Living Room')
      setMinutesAgo(cur.minutes_ago || 0)
      setHistory(Array.isArray(hist) ? hist : [])
      setHeatmap(Array.isArray(heat) ? heat : [])
      setAlerts(Array.isArray(alrt) ? alrt : [])
    } catch (e) {}
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    if (!patientId) return
    loadAll()
    const timer = setInterval(loadAll, 10000)
    return () => clearInterval(timer)
  }, [patientId, loadAll])

  const updateRoom = async (room) => {
    try {
      await fetch('/api/location/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, room, zone: '', source: 'manual', note: '' })
      })
      setCurrentRoom(room)
      setMinutesAgo(0)
      loadAll()
    } catch (e) {}
  }

  return (
    <div className="space-y-5">
      {/* ── HEADER BANNER ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Real-Time Telemetry</span>
            <span className="text-xs text-emerald-800 font-mono">SEN-8492 · Z-Wave Active</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">3D Indoor Localization & Ambient Sensors</h1>
          <p className="text-xs text-emerald-800/80">Interactive 3D isometric residence plan with spatial presence and environmental safety telemetry</p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2 bg-emerald-50 p-1 rounded-full border border-emerald-200">
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'isometric' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            3D Isometric
          </button>
          <button
            onClick={() => setViewMode('cinematic')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'cinematic' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Cinematic Tilt
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === '2d' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            2D Blueprint
          </button>
        </div>
      </div>

      {/* ── MAIN 3D ARCHITECTURAL LAYOUT ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 3D Floor Plan (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                  Residence Spatial Map · Current: <strong className="text-emerald-700">{currentRoom}</strong>
                </span>
              </div>
              <button 
                onClick={() => setShowCamera(!showCamera)}
                className="btn-ghost text-xs py-1 px-3 rounded-full flex items-center gap-1.5"
              >
                <Video size={13} className="text-emerald-700" />
                <span>{showCamera ? 'Hide Live Stream' : 'View CCTV Stream'}</span>
              </button>
            </div>

            {/* Live Camera Feed Drawer */}
            {showCamera && (
              <div className="mb-4 p-3 bg-emerald-950 rounded-xl text-white shadow-lg border border-emerald-800">
                <div className="text-xs text-emerald-300 font-mono mb-2 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    LIVE FEED: {currentRoom.toUpperCase()} · 1080p 30FPS
                  </span>
                  <span className="text-emerald-400 font-bold">YOLOv8 POSE ACTIVE</span>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-emerald-900/50">
                  <img src="http://127.0.0.1:8081/mjpeg" alt="Room Camera" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* 3D Isometric Living Quarters */}
            <IsometricResidence
              currentRoom={currentRoom}
              onSelectRoom={updateRoom}
              viewMode={viewMode}
            />

            <div className="mt-4 flex items-center justify-between text-xs text-emerald-900/70">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-600" />
                Click any 3D room above to simulate patient movement and relocate beacon.
              </span>
              <span className="font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Beacon: Active
              </span>
            </div>
          </div>

          {/* Quick Room Selector Pills */}
          <div className="card p-3.5">
            <div className="text-xs font-bold uppercase text-emerald-900 tracking-wider mb-2.5">
              Simulate Instant Movement
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ROOM_CONFIG.map(r => (
                <button
                  key={r.id}
                  onClick={() => updateRoom(r.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                    currentRoom === r.id 
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm scale-102' 
                      : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/60'
                  }`}
                >
                  <span className="text-sm">{r.icon}</span>
                  <span className="text-[11px] truncate w-full text-center">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Environmental Gauges & Movement Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Smart Environmental Gauges */}
          <div className="card p-4">
            <div className="text-xs font-bold uppercase text-emerald-950 tracking-wider mb-3 flex items-center justify-between">
              <span>Ambient Sensors ({currentRoom})</span>
              <span className="badge badge-subtle text-[10px]">Optimal Range</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Temperature */}
              <div className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white shadow-sm">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-medium">Temperature</span>
                  <Thermometer size={14} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-950 mt-1">{roomDevices.temperature}°C</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Thermostat Target: 22°C</div>
              </div>

              {/* Air Quality */}
              <div className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white shadow-sm">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-medium">Air Quality</span>
                  <Wind size={14} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-950 mt-1">42 AQI</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">HEPA Filter: Active</div>
              </div>

              {/* Circadian Lighting */}
              <div className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white shadow-sm">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-medium">Lighting</span>
                  <Lightbulb size={14} className="text-amber-500" />
                </div>
                <div className="text-xl font-bold text-emerald-950 mt-1">
                  {roomDevices.lights ? '75% Lumens' : 'Standby'}
                </div>
                <button
                  onClick={() => setRoomDevices(d => ({ ...d, lights: !d.lights }))}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline mt-0.5"
                >
                  {roomDevices.lights ? 'Dim Lights' : 'Turn On'}
                </button>
              </div>

              {/* Smart Lock */}
              <div className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white shadow-sm">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-medium">Perimeter</span>
                  <Lock size={14} className="text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-emerald-950 mt-1">Locked</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Doors Secure</div>
              </div>
            </div>
          </div>

          {/* Real-time Movement Log */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                Telemetry Movement Log
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">Live Sync</span>
            </div>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Room Detected</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 6).map((h) => (
                  <tr key={h.id}>
                    <td className="font-mono text-emerald-800 text-xs">
                      {new Date(h.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="font-bold text-emerald-950">{h.room}</td>
                    <td>
                      <span className="badge badge-subtle text-[10px]">
                        {h.source || 'Z-Wave Sensor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}