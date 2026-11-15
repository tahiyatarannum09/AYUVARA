import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Sparkles, Layers, CheckCircle2, AlertTriangle, TrendingUp, Award } from 'lucide-react'

// 3D Voxel Adherence Pillar Visualizer
function IsometricVoxelMatrix({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  if (!data.length) return <div className="text-emerald-800/60 text-xs text-center py-6">No historical records available.</div>

  const last14 = data.slice(-14)

  return (
    <div className="relative p-4 bg-gradient-to-b from-emerald-950/5 via-white to-emerald-50/20 rounded-2xl border border-emerald-900/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-600" />
            3D Isometric Adherence Voxels (14-Day Trajectory)
          </span>
          <p className="text-[11px] text-emerald-800/70">Pillar elevation dynamically corresponds to daily medication compliance rate</p>
        </div>
        <div className="text-xs font-mono bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
          Target: ≥ 85%
        </div>
      </div>

      {/* 3D Voxel Pillars Canvas */}
      <div className="overflow-x-auto py-4">
        <svg viewBox="0 0 700 220" className="w-full min-w-[600px] h-48 select-none">
          <defs>
            <linearGradient id="emeraldTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="emeraldFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="emeraldSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <linearGradient id="amberTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="amberFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="amberSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Isometric Ground Grid Lines */}
          <line x1="20" y1="180" x2="680" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

          {last14.map((d, i) => {
            const pct = d.total ? d.taken / d.total : 0
            const colWidth = 26
            const x = 40 + i * 46
            // Height scales with compliance: 0% = 15px, 100% = 110px
            const pillarHeight = Math.max(16, Math.round(pct * 110))
            const baseY = 175
            const topY = baseY - pillarHeight
            const isHovered = hoveredDay === d.date

            const isFull = pct >= 0.85
            const topFill = isFull ? 'url(#emeraldTop)' : 'url(#amberTop)'
            const frontFill = isFull ? 'url(#emeraldFront)' : 'url(#amberFront)'
            const sideFill = isFull ? 'url(#emeraldSide)' : 'url(#amberSide)'

            return (
              <g
                key={d.date}
                onMouseEnter={() => setHoveredDay(d.date)}
                onMouseLeave={() => setHoveredDay(null)}
                className="cursor-pointer transition-all duration-200"
                transform={isHovered ? `translate(0, -6)` : 'translate(0, 0)'}
              >
                {/* 3D Pillar Base Shadow */}
                <ellipse cx={x + 14} cy={baseY + 4} rx="16" ry="6" fill="#064e3b" opacity="0.12" />

                {/* 3D Front Face */}
                <rect
                  x={x}
                  y={topY}
                  width={colWidth}
                  height={pillarHeight}
                  fill={frontFill}
                  rx="1"
                />

                {/* 3D Right Side Extrusion Face */}
                <polygon
                  points={`${x + colWidth},${topY} ${x + colWidth + 10},${topY - 8} ${x + colWidth + 10},${baseY - 8} ${x + colWidth},${baseY}`}
                  fill={sideFill}
                />

                {/* 3D Isometric Top Cap */}
                <polygon
                  points={`${x},${topY} ${x + 10},${topY - 8} ${x + colWidth + 10},${topY - 8} ${x + colWidth},${topY}`}
                  fill={topFill}
                  stroke={isHovered ? '#ffffff' : 'none'}
                  strokeWidth="1.5"
                />

                {/* Label on top of pillar */}
                <text
                  x={x + 13}
                  y={topY - 12}
                  textAnchor="middle"
                  fill={isFull ? '#065f46' : '#92400e'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  {Math.round(pct * 100)}%
                </text>

                {/* Date Label on ground */}
                <text
                  x={x + 13}
                  y={baseY + 20}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="8.5"
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {d.date.slice(5)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-emerald-900/80 mt-2 pt-2 border-t border-emerald-900/10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-600 inline-block"/> High Adherence (≥85%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500 inline-block"/> Moderate (60–84%)</span>
        </div>
        <span className="text-[11px] text-emerald-800 font-medium">Auto-aggregated by ElderCare Cron Service</span>
      </div>
    </div>
  )
}

export default function Adherence() {
  const { patientId } = useApp()
  const [heatmap, setHeatmap] = useState([])
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getHeatmap(patientId), api.getMoodLogs(patientId)])
      .then(([h, m]) => { setHeatmap(h); setMoods(m) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [patientId])

  const totalDoses = heatmap.reduce((s,d) => s + d.total, 0)
  const takenDoses = heatmap.reduce((s,d) => s + d.taken, 0)
  const missedDoses = heatmap.reduce((s,d) => s + d.missed, 0)
  const overallPct = totalDoses ? Math.round(takenDoses / totalDoses * 100) : 0

  return (
    <div className="space-y-5">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Pharmacotherapy Analytics</span>
            <span className="text-xs text-emerald-800 font-mono">14-Day Moving Average</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">Medication Adherence & 3D Voxel Compliance</h1>
          <p className="text-xs text-emerald-800/80">Evaluation of daily scheduled doses, ingestion logs, and caregiver alert triggers</p>
        </div>
      </div>

      {/* ── 3-METRIC KPI TILES ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Compliance</span>
            <Award size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 mt-1.5">{overallPct}%</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Clinical Goal: ≥ 85.0%</div>
        </div>

        <div className="card p-4 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Ingestion</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1.5">{takenDoses}</div>
          <div className="text-xs text-emerald-800/70 mt-1">Verified patient doses</div>
        </div>

        <div className="card p-4 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Missed / Escalated</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 mt-1.5">{missedDoses}</div>
          <div className="text-xs text-emerald-800/70 mt-1">Proactive emails dispatched</div>
        </div>
      </div>

      {/* ── 3D VOXEL ADHERENCE PILLAR MATRIX ─────────────────────────────── */}
      <div className="card p-5">
        {loading ? (
          <div className="animate-pulse h-48 bg-emerald-50/50 rounded-xl" />
        ) : (
          <IsometricVoxelMatrix data={heatmap} />
        )}
      </div>
    </div>
  )
}
