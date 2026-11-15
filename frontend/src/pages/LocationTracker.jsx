import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { 
  Compass, Radio, Thermometer, Wind, Lightbulb, Lock, Video, 
  Sparkles, Layers
} from 'lucide-react'

// Isometric Room Geometry definitions (30-degree coordinate projection)
const ROOM_CONFIG = [
  {
    id: 'Bedroom',
    label: 'Master Bedroom',
    type: 'soft',
    icon: '🛏️',
    coords: 'M 140,80 L 260,145 L 140,210 L 20,145 Z',
    center: { x: 140, y: 145 },
  },
  {
    id: 'Bathroom',
    label: 'Bathroom',
    type: 'tile',
    icon: '🚿',
    coords: 'M 260,145 L 340,188 L 260,230 L 180,188 Z',
    center: { x: 260, y: 188 },
  },
  {
    id: 'Study',
    label: 'Study',
    type: 'wood',
    icon: '📚',
    coords: 'M 340,188 L 460,252 L 380,295 L 260,230 Z',
    center: { x: 360, y: 240 },
  },
  {
    id: 'Living Room',
    label: 'Living Room',
    type: 'wood',
    icon: '🛋️',
    coords: 'M 140,210 L 300,295 L 180,360 L 20,275 Z',
    center: { x: 160, y: 285 },
  },
  {
    id: 'Hallway',
    label: 'Hallway',
    type: 'slate',
    icon: '🚪',
    coords: 'M 260,230 L 380,295 L 300,338 L 180,273 Z',
    center: { x: 280, y: 284 },
  },
  {
    id: 'Kitchen',
    label: 'Kitchen',
    type: 'marble',
    icon: '🍳',
    coords: 'M 300,295 L 460,380 L 340,445 L 180,360 Z',
    center: { x: 320, y: 370 },
  }
]

function IsometricResidence({ currentRoom, onSelectRoom, viewMode }) {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F7FB] via-white to-[#D6E6F2]/30 rounded-2xl border border-[#D6E6F2] p-4 shadow-sm">
      <svg
        viewBox="0 0 500 480"
        className="w-full h-auto drop-shadow-lg select-none transition-transform duration-500"
        style={{
          transform: viewMode === 'cinematic' ? 'scale(1.06) translateY(-8px)' : 'scale(1)'
        }}
      >
        <defs>
          <linearGradient id="softFloor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#F2F7FB" />
          </linearGradient>

          <linearGradient id="activeFloorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8DB4D6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D6E6F2" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="blueWallLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D6E6F2" />
            <stop offset="100%" stopColor="#8DB4D6" />
          </linearGradient>

          <linearGradient id="blueWallRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Outer 3D Foundation Slab */}
        <g opacity="0.9">
          <path
            d="M 20,175 L 140,110 L 460,282 L 340,475 L 180,390 L 20,305 Z"
            fill="#8DB4D6"
            opacity="0.1"
            transform="translate(0, 14)"
          />
          <path d="M 20,275 L 180,360 L 180,370 L 20,285 Z" fill="#94a3b8" />
          <path d="M 180,360 L 340,445 L 340,455 L 180,370 Z" fill="#64748b" />
          <path d="M 340,445 L 460,380 L 460,390 L 340,455 Z" fill="#475569" />
        </g>

        {/* 3D Extruded Rear Walls */}
        <g>
          <path d="M 20,145 L 140,80 L 140,45 L 20,110 Z" fill="url(#blueWallLeft)" stroke="#8DB4D6" strokeWidth="0.8" />
          <path d="M 140,80 L 460,252 L 460,217 L 140,45 Z" fill="url(#blueWallRight)" stroke="#64748b" strokeWidth="0.8" />
          <path d="M 260,145 L 260,120 L 140,55 L 140,80 Z" fill="#e2e8f0" opacity="0.85" />
        </g>

        {/* Isometric Rooms */}
        {ROOM_CONFIG.map(room => {
          const isActive = room.id === currentRoom

          return (
            <g
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className="cursor-pointer group"
            >
              {/* Floor Polygon */}
              <path
                d={room.coords}
                fill={isActive ? 'url(#activeFloorGlow)' : 'url(#softFloor)'}
                stroke={isActive ? '#38bdf8' : '#D6E6F2'}
                strokeWidth={isActive ? '2.5' : '1'}
                className="transition-all duration-300"
              />

              {/* 3D Furniture Accents */}
              {room.id === 'Bedroom' && (
                <g opacity="0.9">
                  <path d="M 85,120 L 135,148 L 105,165 L 55,137 Z" fill="#e2e8f0" stroke="#D6E6F2" strokeWidth="0.8" />
                  <path d="M 85,116 L 135,144 L 105,161 L 55,133 Z" fill="#8DB4D6" opacity="0.8" />
                  <ellipse cx="78" cy="126" rx="8" ry="4" fill="#ffffff" />
                  <ellipse cx="98" cy="137" rx="8" ry="4" fill="#ffffff" />
                </g>
              )}

              {room.id === 'Living Room' && (
                <g opacity="0.95">
                  <path d="M 100,245 L 145,270 L 130,280 L 85,255 Z" fill="#1A2F4C" stroke="#2B4C7E" strokeWidth="0.8" />
                  <path d="M 145,270 L 175,287 L 165,295 L 130,280 Z" fill="#2B4C7E" stroke="#1A2F4C" strokeWidth="0.8" />
                  <path d="M 160,265 L 185,280 L 170,290 L 145,275 Z" fill="#fde047" opacity="0.7" />
                </g>
              )}

              {room.id === 'Kitchen' && (
                <g opacity="0.9">
                  <path d="M 280,340 L 350,380 L 330,395 L 260,355 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                  <circle cx="295" cy="355" r="2" fill="#f43f5e" />
                  <circle cx="315" cy="367" r="2" fill="#f43f5e" />
                </g>
              )}

              {room.id === 'Bathroom' && (
                <g opacity="0.9">
                  <ellipse cx="255" cy="180" rx="15" ry="9" fill="#ffffff" stroke="#8DB4D6" strokeWidth="1" />
                  <line x1="230" y1="185" x2="245" y2="194" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}

              {/* Room Label Badge */}
              <g transform={`translate(${room.center.x}, ${room.center.y})`}>
                <rect
                  x="-38"
                  y="-10"
                  width="76"
                  height="20"
                  rx="10"
                  fill={isActive ? '#1A2F4C' : '#ffffff'}
                  stroke={isActive ? '#38bdf8' : '#D6E6F2'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  className="shadow-sm transition-all"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  fill={isActive ? '#ffffff' : '#1A2F4C'}
                  fontSize="9"
                  fontWeight={isActive ? '700' : '600'}
                  className="pointer-events-none"
                >
                  {room.label}
                </text>
              </g>

              {/* ACTIVE 3D HOLOGRAPHIC PRESENCE BEACON */}
              {isActive && (
                <g transform={`translate(${room.center.x}, ${room.center.y})`} className="pointer-events-none">
                  {/* Radar Ripple */}
                  <ellipse cx="0" cy="2" rx="30" ry="16" fill="none" stroke="#38bdf8" strokeWidth="2">
                    <animate attributeName="rx" values="10;36;10" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="5;18;5" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.2s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Stalk */}
                  <line x1="0" y1="2" x2="0" y2="-32" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />

                  {/* Levitating Pin */}
                  <g transform="translate(0, -36)">
                    <circle cx="0" cy="0" r="13" fill="#1A2F4C" stroke="#38bdf8" strokeWidth="2.5">
                      <animate attributeName="cy" values="0;-4;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">DW</text>
                  </g>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full border border-[#D6E6F2] shadow-sm flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
        <span className="font-bold text-[#1A2F4C]">Dorothy is in the {currentRoom}</span>
      </div>
    </div>
  )
}

export default function LocationTracker() {
  const { patientId } = useApp()
  const [currentRoom, setCurrentRoom] = useState('Living Room')
  const [history, setHistory] = useState([])
  const [showCamera, setShowCamera] = useState(false)
  const [viewMode, setViewMode] = useState('isometric')

  const load = useCallback(async () => {
    try {
      const [cur, hist] = await Promise.all([
        api.getLocationCurrent(patientId),
        api.getLocationHistory(patientId),
      ])
      setCurrentRoom(cur?.room || 'Living Room')
      setHistory(Array.isArray(hist) ? hist : [])
    } catch (e) {}
  }, [patientId])

  useEffect(() => {
    if (!patientId) return
    load()
    const timer = setInterval(load, 10000)
    return () => clearInterval(timer)
  }, [patientId, load])

  const updateRoom = async (room) => {
    try {
      await api.updateLocation({ patient_id: patientId, room, zone: '', source: 'manual', note: '' })
      setCurrentRoom(room)
      load()
    } catch (e) {}
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">3D Residence & Spatial Presence</h1>
          <p className="text-xs text-[#4A6B8F]">Real-time room localization and environmental gauges</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(v => v === 'isometric' ? 'cinematic' : 'isometric')}
            className="btn-soft text-xs py-1.5 px-3"
          >
            {viewMode === 'isometric' ? 'Cinematic Angle' : 'Standard 3D'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 3D Residence Plan */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D6E6F2]">
              <span className="text-xs font-bold text-[#1A2F4C]">
                Active Zone: <strong className="text-[#38bdf8]">{currentRoom}</strong>
              </span>
              <button 
                onClick={() => setShowCamera(!showCamera)}
                className="btn-ghost text-xs py-1 px-3 rounded-full flex items-center gap-1.5"
              >
                <Video size={13} className="text-[#8DB4D6]" />
                <span>{showCamera ? 'Close Camera' : 'Live Camera'}</span>
              </button>
            </div>

            {showCamera && (
              <div className="mb-4 p-2 bg-slate-900 rounded-xl text-white shadow-md">
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src="http://127.0.0.1:8081/mjpeg" 
                    alt="Room Camera" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.src = '/images/cctv_sitting.jpg' }}
                  />
                </div>
              </div>
            )}

            <IsometricResidence
              currentRoom={currentRoom}
              onSelectRoom={updateRoom}
              viewMode={viewMode}
            />
          </div>

          {/* Quick Room Selectors */}
          <div className="card p-3">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ROOM_CONFIG.map(r => (
                <button
                  key={r.id}
                  onClick={() => updateRoom(r.id)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                    currentRoom === r.id 
                      ? 'bg-[#1A2F4C] text-white border-[#1A2F4C] shadow-sm' 
                      : 'bg-[#F2F7FB] text-[#1A2F4C] border-[#D6E6F2] hover:bg-[#D6E6F2]'
                  }`}
                >
                  <div className="text-base">{r.icon}</div>
                  <div className="text-[10px] mt-0.5 truncate">{r.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Clean Sensor Gauges & History */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-4">
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider mb-3">
              Room Environment ({currentRoom})
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F2F7FB] border border-[#D6E6F2]">
                <div className="text-[#4A6B8F] font-medium">Temperature</div>
                <div className="text-xl font-bold text-[#1A2F4C] mt-0.5">22°C</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Comfortable</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2F7FB] border border-[#D6E6F2]">
                <div className="text-[#4A6B8F] font-medium">Air Quality</div>
                <div className="text-xl font-bold text-[#1A2F4C] mt-0.5">42 AQI</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Clean Air</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2F7FB] border border-[#D6E6F2]">
                <div className="text-[#4A6B8F] font-medium">Lighting</div>
                <div className="text-lg font-bold text-[#1A2F4C] mt-0.5">75%</div>
                <div className="text-[10px] text-[#4A6B8F]">Circadian LED</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2F7FB] border border-[#D6E6F2]">
                <div className="text-[#4A6B8F] font-medium">Perimeter</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">Locked</div>
                <div className="text-[10px] text-[#4A6B8F]">Secure</div>
              </div>
            </div>
          </div>

          {/* Movement History */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#F2F7FB] border-b border-[#D6E6F2] text-xs font-bold text-[#1A2F4C]">
              Recent Movement
            </div>
            <table className="clinical-table">
              <tbody>
                {history.slice(0, 5).map(h => (
                  <tr key={h.id}>
                    <td className="font-mono text-xs text-[#4A6B8F]">
                      {new Date(h.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="font-bold text-xs text-[#1A2F4C]">{h.room}</td>
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
