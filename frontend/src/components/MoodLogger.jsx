import { useState } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Check } from 'lucide-react'

export default function MoodLogger({ onLogged }) {
  const { patientId } = useApp()
  const [mood, setMood] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [pain, setPain] = useState(0)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!mood || !energy) return
    setLoading(true)
    try {
      await api.logMood({ patient_id: patientId, mood, energy, pain_level: pain, notes })
      setSaved(true)
      onLogged?.()
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (saved)
    return (
      <div className="card p-4 border-blue-300 bg-blue-50 text-center rounded-2xl shadow-sm">
        <div className="text-blue-900 font-extrabold text-xs flex items-center justify-center gap-2">
          <Check size={16} className="text-blue-600" />
          Assessment saved
        </div>
      </div>
    )

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-blue-900/10">
        <h3 className="text-sm font-extrabold text-blue-950">Vital Assessment</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Mood */}
        <div>
          <label className="label text-blue-950">Mood (1–5)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[{ val: 1, label: 'Low' }, { val: 2, label: 'Fair' }, { val: 3, label: 'Stable' }, { val: 4, label: 'Good' }, { val: 5, label: 'Optimal' }].map(m => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  mood === m.val
                    ? 'bg-blue-900 border-blue-900 text-white font-bold shadow-sm'
                    : 'bg-blue-50/50 border-blue-200/80 text-blue-950 hover:bg-blue-100/60'
                }`}
              >
                <div>{m.val}</div>
                <div className="text-[9px] opacity-80">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div>
          <label className="label text-blue-950">Energy (1–5)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[{ val: 1, label: 'Fatigued' }, { val: 2, label: 'Low' }, { val: 3, label: 'Normal' }, { val: 4, label: 'Active' }, { val: 5, label: 'Alert' }].map(e => (
              <button
                key={e.val}
                onClick={() => setEnergy(e.val)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  energy === e.val
                    ? 'bg-blue-900 border-blue-900 text-white font-bold shadow-sm'
                    : 'bg-blue-50/50 border-blue-200/80 text-blue-950 hover:bg-blue-100/60'
                }`}
              >
                <div>{e.val}</div>
                <div className="text-[9px] opacity-80">{e.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pain */}
      <div className="mb-4 p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0 text-blue-950">Pain (0–10)</label>
          <span className={`text-xs font-mono font-bold ${pain === 0 ? 'text-blue-700' : pain >= 7 ? 'text-rose-700' : 'text-amber-700'}`}>
            Level: {pain} / 10 ({pain === 0 ? 'No Discomfort' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Mod' : 'Sev'})
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={pain}
          onChange={e => setPain(Number(e.target.value))}
          className="w-full accent-blue-800 cursor-pointer h-2 bg-blue-200 rounded appearance-none"
        />
        <div className="flex justify-between text-[10px] text-blue-800/70 font-mono mt-1">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="label text-blue-950">Notes</label>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. mild stiffness, stable appetite"
          className="input"
        />
      </div>

      <button
        onClick={submit}
        disabled={!mood || !energy || loading}
        className="btn-primary w-full py-2.5 rounded-full text-xs font-bold shadow-md"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
