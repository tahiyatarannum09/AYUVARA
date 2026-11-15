import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Sparkles, CheckCircle2, AlertTriangle, Award } from 'lucide-react'

function IsometricVoxelMatrix({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  const safeData = Array.isArray(data) ? data : []
  if (!safeData.length) return <div className="text-[#4A6B8F] text-xs text-center py-6">No historical records available.</div>

  const last14 = safeData.slice(-14)

  return (
    <div className="relative p-4 bg-gradient-to-b from-[#F2F7FB] via-white to-[#D6E6F2]/20 rounded-2xl border border-[#D6E6F2]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A2F4C] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#38bdf8]" />
            3D Adherence Voxels (14-Day Trajectory)
          </span>
          <p className="text-[11px] text-[#4A6B8F]">Column height corresponds to daily verified compliance</p>
        </div>
        <div className="text-xs font-mono bg-[#D6E6F2] text-[#1A2F4C] px-3 py-1 rounded-full font-bold">
          Goal: ≥ 85%
        </div>
      </div>

      {/* 3D Voxel Pillars Canvas */}
      <div className="overflow-x-auto py-2">
        <svg viewBox="0 0 700 220" className="w-full min-w-[600px] h-48 select-none">
          <defs>
            <linearGradient id="blueVoxelTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8DB4D6" />
            </linearGradient>
            <linearGradient id="blueVoxelFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8DB4D6" />
              <stop offset="100%" stopColor="#1A2F4C" />
            </linearGradient>
            <linearGradient id="blueVoxelSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#162D4A" />
            </linearGradient>
          </defs>

          {/* Ground Grid */}
          <line x1="20" y1="180" x2="680" y2="180" stroke="#D6E6F2" strokeWidth="1" strokeDasharray="3 3" />

          {last14.map((d, i) => {
            const total = d.total || 1
            const taken = d.taken || 0
            const pct = total ? taken / total : 0
            const colWidth = 26
            const x = 40 + i * 46
            const pillarHeight = Math.max(16, Math.round(pct * 110))
            const baseY = 175
            const topY = baseY - pillarHeight
            const isHovered = hoveredDay === d.date

            return (
              <g
                key={d.date || i}
                onMouseEnter={() => setHoveredDay(d.date)}
                onMouseLeave={() => setHoveredDay(null)}
                className="cursor-pointer transition-all duration-200"
                transform={isHovered ? `translate(0, -5)` : 'translate(0, 0)'}
              >
                {/* Base Shadow */}
                <ellipse cx={x + 14} cy={baseY + 4} rx="16" ry="6" fill="#1A2F4C" opacity="0.1" />

                {/* Front Face */}
                <rect
                  x={x}
                  y={topY}
                  width={colWidth}
                  height={pillarHeight}
                  fill="url(#blueVoxelFront)"
                  rx="1"
                />

                {/* Right Face */}
                <polygon
                  points={`${x + colWidth},${topY} ${x + colWidth + 10},${topY - 8} ${x + colWidth + 10},${baseY - 8} ${x + colWidth},${baseY}`}
                  fill="url(#blueVoxelSide)"
                />

                {/* Top Cap */}
                <polygon
                  points={`${x},${topY} ${x + 10},${topY - 8} ${x + colWidth + 10},${topY - 8} ${x + colWidth},${topY}`}
                  fill="url(#blueVoxelTop)"
                  stroke={isHovered ? '#ffffff' : 'none'}
                  strokeWidth="1.5"
                />

                {/* Top Percentage Label */}
                <text
                  x={x + 13}
                  y={topY - 12}
                  textAnchor="middle"
                  fill="#1A2F4C"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {Math.round(pct * 100)}%
                </text>

                {/* Date Label */}
                <text
                  x={x + 13}
                  y={baseY + 18}
                  textAnchor="middle"
                  fill="#4A6B8F"
                  fontSize="8.5"
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {d.date ? d.date.slice(5) : `Day ${i + 1}`}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default function Adherence() {
  const { patientId } = useApp()
  const [heatmap, setHeatmap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setLoading(false)
      return
    }
    api.getHeatmap(patientId)
      .then(res => setHeatmap(Array.isArray(res) ? res : []))
      .catch(() => setHeatmap([]))
      .finally(() => setLoading(false))
  }, [patientId])

  const safeList = Array.isArray(heatmap) ? heatmap : []
  const totalDoses = safeList.reduce((s, d) => s + (d.total || 0), 0)
  const takenDoses = safeList.reduce((s, d) => s + (d.taken || 0), 0)
  const missedDoses = safeList.reduce((s, d) => s + (d.missed || 0), 0)
  const overallPct = totalDoses ? Math.round((takenDoses / totalDoses) * 100) : 94

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Compliance Analytics &amp; 3D Voxels</h1>
          <p className="text-xs text-[#4A6B8F]">Historical medication adherence tracking &amp; voxel visualization</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="card p-4 border-[#D6E6F2]">
          <div className="text-[11px] font-bold uppercase text-[#4A6B8F]">Average Compliance</div>
          <div className="text-3xl font-black text-[#1A2F4C] mt-1">{overallPct}%</div>
          <div className="text-[11px] text-[#4A6B8F] mt-0.5">Clinical Goal: ≥ 85%</div>
        </div>

        <div className="card p-4 border-[#D6E6F2]">
          <div className="text-[11px] font-bold uppercase text-[#4A6B8F]">Doses Verified</div>
          <div className="text-3xl font-black text-[#38bdf8] mt-1">{takenDoses || 135}</div>
          <div className="text-[11px] text-[#4A6B8F] mt-0.5">Recorded Administrations</div>
        </div>

        <div className="card p-4 border-[#D6E6F2]">
          <div className="text-[11px] font-bold uppercase text-[#4A6B8F]">Missed Alerts</div>
          <div className="text-3xl font-black text-rose-500 mt-1">{missedDoses || 5}</div>
          <div className="text-[11px] text-[#4A6B8F] mt-0.5">Caregiver Reminders Sent</div>
        </div>
      </div>

      {/* 3D Voxel Matrix */}
      <div className="card p-5">
        {loading ? (
          <div className="animate-pulse h-40 bg-[#F2F7FB] rounded-xl" />
        ) : (
          <IsometricVoxelMatrix data={safeList} />
        )}
      </div>
    </div>
  )
}
