import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Check, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

// Ayuvara Capsule Palette (matching 3D logo with Cyan & Peach)
const CAPSULE_PALETTES = [
  { left: '#38bdf8', right: '#fb923c' },
  { left: '#818cf8', right: '#f472b6' },
  { left: '#34d399', right: '#fde047' },
  { left: '#60a5fa', right: '#f87171' },
]

function formatTime12(timeStr) {
  if (!timeStr) return ''
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m < 10 ? '0' + m : m} ${ampm}`
  } catch (e) {
    return timeStr
  }
}

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
          {taken} of {total} Doses Ingested
        </div>
      </div>

      {doses.length === 0 ? (
        <div className="text-[#4A6B8F] text-xs text-center py-6">No scheduled medications recorded for today.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Scheduled</th>
                <th>3D Pill</th>
                <th>Prescription</th>
                <th>Dosage</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose, idx) => {
                const palette = CAPSULE_PALETTES[idx % CAPSULE_PALETTES.length]
                const dosageNumber = (dose.dosage || '').split(' ')[0] || 'mg'
                const isTaken = dose.status === 'taken'
                const isMissed = dose.status === 'missed'
                const isPending = dose.status === 'pending'

                return (
                  <tr key={dose.log_id} className="hover:bg-[#F2F7FB] transition-colors">
                    {/* Senior-friendly 12-hour formatted time */}
                    <td className="font-mono font-bold text-xs text-[#1A2F4C] whitespace-nowrap">
                      {formatTime12(dose.scheduled_time)}
                    </td>

                    {/* 3D Ayuvara Bi-Color Capsule */}
                    <td className="py-2.5">
                      <div 
                        onClick={() => !isTaken && mark(dose.log_id, 'taken')}
                        className="pill-capsule-3d cursor-pointer" 
                        title={`Click to verify ${dose.medication_name}`}
                      >
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
                      <div className="text-[10px] text-[#4A6B8F] capitalize">
                        {dose.with_food ? 'With meal' : 'Standard'}
                      </div>
                    </td>

                    <td className="font-mono text-[#1A2F4C] text-xs font-semibold whitespace-nowrap">
                      {dose.dosage}
                    </td>

                    {/* Refined High-Contrast Status Pills */}
                    <td>
                      {isTaken && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Check size={10} /> Ingested
                        </span>
                      )}
                      {isMissed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle size={10} /> Overdue
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                    </td>

                    {/* Clean Contextual Actions */}
                    <td className="text-right whitespace-nowrap">
                      {isPending && (
                        <div className="inline-flex gap-1.5">
                          <button 
                            onClick={() => mark(dose.log_id, 'taken')}
                            className="btn-primary text-xs py-1 px-3 shadow-sm"
                          >
                            <Check size={12} /> Take Dose
                          </button>
                          <button 
                            onClick={() => mark(dose.log_id, 'skipped')}
                            className="btn-ghost text-xs py-1 px-2 text-[#4A6B8F]"
                          >
                            Skip
                          </button>
                        </div>
                      )}
                      {isMissed && (
                        <button 
                          onClick={() => mark(dose.log_id, 'taken')}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors shadow-sm"
                        >
                          Take Now
                        </button>
                      )}
                      {isTaken && (
                        <span className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          Verified
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
