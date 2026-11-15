import { useState } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Activity, Check, Sparkles } from 'lucide-react'

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
    } catch(e) {}
    setLoading(false)
  }

  if (saved) return (
    <div className="card p-4 border-emerald-300 bg-emerald-50 text-center rounded-2xl shadow-sm">
      <div className="text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-2">
        <Check size={16} className="text-emerald-600" />
        Subjective Vital Assessment Logged to Dorothy's Chart
      </div>
    </div>
  )

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-emerald-900/10">
        <div>
          <h3 className="text-sm font-extrabold text-emerald-950">Patient Subjective Vital Assessment</h3>
          <p className="text-xs text-emerald-800/70">Daily self-reported comfort, mobility stamina, and clinical pain scale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Mood / Comfort */}
        <div>
          <label className="label text-emerald-950">Cognitive & Mood State (1–5)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { val: 1, label: 'Low' },
              { val: 2, label: 'Fair' },
              { val: 3, label: 'Stable' },
              { val: 4, label: 'Good' },
              { val: 5, label: 'Optimal' },
            ].map(m => (
              <button 
                key={m.val} 
                onClick={() => setMood(m.val)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  mood === m.val 
                    ? 'bg-emerald-900 border-emerald-900 text-white font-bold shadow-sm' 
                    : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950 hover:bg-emerald-100/60'
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
          <label className="label text-emerald-950">Physical Stamina / Mobility (1–5)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { val: 1, label: 'Fatigued' },
              { val: 2, label: 'Low' },
              { val: 3, label: 'Normal' },
              { val: 4, label: 'Active' },
              { val: 5, label: 'Alert' },
            ].map(e => (
              <button 
                key={e.val} 
                onClick={() => setEnergy(e.val)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  energy === e.val 
                    ? 'bg-emerald-900 border-emerald-900 text-white font-bold shadow-sm' 
                    : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950 hover:bg-emerald-100/60'
                }`}
              >
                <div>{e.val}</div>
                <div className="text-[9px] opacity-80">{e.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pain Rating (NRS-11 Standard) */}
      <div className="mb-4 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0 text-emerald-950">Standard Pain Score (NRS-11 Scale)</label>
          <span className={`text-xs font-mono font-bold ${pain === 0 ? 'text-emerald-700' : pain >= 7 ? 'text-rose-700' : 'text-amber-700'}`}>
            Level: {pain} / 10 ({pain === 0 ? 'No Discomfort' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : 'Severe'})
          </span>
        </div>
        <input 
          type="range" min={0} max={10} value={pain} 
          onChange={e => setPain(Number(e.target.value))}
          className="w-full accent-emerald-800 cursor-pointer h-2 bg-emerald-200 rounded appearance-none" 
        />
        <div className="flex justify-between text-[10px] text-emerald-800/70 font-mono mt-1">
          <span>0 (Comfortable)</span>
          <span>5 (Moderate)</span>
          <span>10 (Severe)</span>
        </div>
      </div>

      {/* Observations */}
      <div className="mb-4">
        <label className="label text-emerald-950">Patient Sensation / Symptom Observations</label>
        <input 
          value={notes} 
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Mild morning joint stiffness, normal appetite, blood pressure stable..." 
          className="input" 
        />
      </div>

      <button 
        onClick={submit} 
        disabled={!mood || !energy || loading} 
        className="btn-primary w-full py-2.5 rounded-full text-xs font-bold shadow-md"
      >
        {loading ? 'Recording...' : 'Save Assessment to Dorothy Williams\'s Record'}
      </button>
    </div>
  )
}
