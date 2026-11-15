import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Check, CheckCircle2 } from 'lucide-react'

// Ayuvara Capsule Palette (matching 3D logo with Cyan & Peach)
const CAPSULE_PALETTES = [
  { left: '#38bdf8', right: '#fb923c' },
  { left: '#818cf8', right: '#f472b6' },
  { left: '#34d399', right: '#fde047' },
  { left: '#60a5fa', right: '#f87171' },
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

  if (loading) return <div className="card animate-pulse h-36 bg-[#F2F7FB]" />

  const taken = doses.filter(d => d.status === 'taken').length
  const total = doses.length

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6E6F2]">
        <div>
          <h3 className="text-sm font-bold text-[#1A2F4C]">Today's Medication Schedule</h3>
          <p className="text-xs text-[#4A6B8F]">Verified administration schedule</p>
        </div>
        <div className="text-xs font-semibold text-[#1A2F4C] bg-[#D6E6F2] px-3 py-1 rounded-full">
          {taken}/{total} Doses Taken
        </div>
      </div>

      {doses.length === 0 ? (
        <div className="text-[#4A6B8F] text-xs text-center py-6">No scheduled medications recorded for today.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>3D Pill</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose, idx) => {
                const palette = CAPSULE_PALETTES[idx % CAPSULE_PALETTES.length]
                const dosageNumber = (dose.dosage || '').split(' ')[0] || 'mg'

                return (
                  <tr key={dose.log_id} className="hover:bg-[#F2F7FB] transition-colors">
                    <td className="font-mono font-bold text-[#1A2F4C] whitespace-nowrap">
                      {dose.scheduled_time}
                    </td>

                    {/* 3D Ayuvara Bi-Color Capsule */}
                    <td className="py-2">
                      <div className="pill-capsule-3d cursor-pointer" title={dose.medication_name}>
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[9px] font-black text-white"
                          style={{ backgroundColor: palette.left }}
                        >
                          Rx
                        </div>
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[8px] font-extrabold text-[#1A2F4C]"
                          style={{ backgroundColor: palette.right }}
                        >
                          {dosageNumber.slice(0, 4)}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-bold text-[#1A2F4C] text-xs">{dose.medication_name}</div>
                      <div className="text-[10px] text-[#4A6B8F] capitalize">{dose.form || 'tablet'}</div>
                    </td>

                    <td className="font-mono text-[#1A2F4C] text-xs font-semibold whitespace-nowrap">
                      {dose.dosage}
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
                            className="btn-primary text-xs py-1 px-3 shadow-sm"
                          >
                            <Check size={12} /> Take Dose
                          </button>
                          <button 
                            onClick={() => mark(dose.log_id, 'skipped')}
                            className="btn-ghost text-xs py-1 px-2.5 text-[#4A6B8F]"
                          >
                            Skip
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#4A6B8F] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 size={12} className="text-[#38bdf8]" />
                          Completed
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
