import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Check, Clock, CheckCircle2, X, Sparkles, AlertCircle } from 'lucide-react'

// Realistic capsule color palettes based on medication index
const CAPSULE_PALETTES = [
  { left: '#059669', right: '#fef08a', leftText: '#ffffff', rightText: '#064e3b' }, // Emerald / Gold
  { left: '#0284c7', right: '#ffffff', leftText: '#ffffff', rightText: '#0369a1' }, // Sky / White
  { left: '#dc2626', right: '#fee2e2', leftText: '#ffffff', rightText: '#991b1b' }, // Crimson / Porcelain
  { left: '#7c3aed', right: '#ede9fe', leftText: '#ffffff', rightText: '#5b21b6' }, // Purple / Lavender
  { left: '#ea580c', right: '#ffedd5', leftText: '#ffffff', rightText: '#9a3412' }, // Tangerine / Cream
]

export default function TodayDoses({ onRefresh }) {
  const { patientId } = useApp()
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const d = await api.getTodayAdherence(patientId)
      setDoses(d.sort((a,b) => a.scheduled_time.localeCompare(b.scheduled_time)))
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [patientId])

  const mark = async (log_id, status) => {
    try {
      await api.markDose(log_id, status)
      load()
      onRefresh?.()
    } catch(e) {}
  }

  if (loading) return <div className="card animate-pulse h-36" />

  const taken = doses.filter(d => d.status === 'taken').length
  const pct = doses.length ? Math.round(taken / doses.length * 100) : 0

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between pb-3.5 mb-3.5 border-b border-emerald-900/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-emerald-950">Medication Administration Schedule</h3>
            <span className="badge badge-subtle text-[10px]">Today</span>
          </div>
          <p className="text-xs text-emerald-800/70">Interactive 3D prescription capsules & one-click administration verification</p>
        </div>
        <div className="text-xs text-emerald-900 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          Compliance: <strong className="text-emerald-950">{taken} of {doses.length} Doses ({pct}%)</strong>
        </div>
      </div>

      {doses.length === 0 ? (
        <div className="text-emerald-800/60 text-xs text-center py-8">No scheduled medications recorded for today.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Scheduled</th>
                <th>3D Capsule</th>
                <th>Prescription</th>
                <th>Dosage</th>
                <th>Food Routine</th>
                <th>Status</th>
                <th className="text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose, idx) => {
                const palette = CAPSULE_PALETTES[idx % CAPSULE_PALETTES.length]
                const dosageNumber = (dose.dosage || '').split(' ')[0] || 'mg'

                return (
                  <tr key={dose.log_id} className="transition-colors hover:bg-emerald-50/50">
                    <td className="font-mono font-bold text-emerald-900 whitespace-nowrap">
                      {dose.scheduled_time}
                    </td>

                    {/* 3D Interactive Bi-Color Capsule */}
                    <td className="py-2">
                      <div 
                        className="pill-capsule-3d cursor-pointer"
                        title={`${dose.medication_name} (${dose.dosage})`}
                      >
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[9px] font-black tracking-tighter"
                          style={{ backgroundColor: palette.left, color: palette.leftText }}
                        >
                          Rx
                        </div>
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[8px] font-extrabold tracking-tighter"
                          style={{ backgroundColor: palette.right, color: palette.rightText }}
                        >
                          {dosageNumber.slice(0, 4)}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-bold text-emerald-950 text-xs">{dose.medication_name}</div>
                      <div className="text-[10px] text-emerald-700 font-medium capitalize">{dose.form || 'tablet'}</div>
                    </td>

                    <td className="font-mono text-emerald-900 text-xs font-semibold whitespace-nowrap">
                      {dose.dosage}
                    </td>

                    <td className="text-xs">
                      {dose.with_food ? (
                        <span className="text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                          With Meal
                        </span>
                      ) : (
                        <span className="text-emerald-900/60 text-[11px]">Empty Stomach</span>
                      )}
                    </td>

                    <td>
                      <span className={`badge text-[10px] status-${dose.status}`}>
                        {dose.status}
                      </span>
                    </td>

                    <td className="text-right whitespace-nowrap">
                      {dose.status === 'pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button 
                            onClick={() => mark(dose.log_id, 'taken')}
                            className="btn-success text-xs py-1 px-3 shadow-sm"
                            title="Verify Dose Ingested"
                          >
                            <Check size={12} /> Confirm Ingested
                          </button>
                          <button 
                            onClick={() => mark(dose.log_id, 'skipped')}
                            className="btn-ghost text-xs py-1 px-2.5 text-emerald-800"
                            title="Skip this dose"
                          >
                            Skip
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-800/80 font-mono flex items-center justify-end gap-1">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          Logged
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
