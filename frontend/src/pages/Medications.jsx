import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Plus, Trash2, Edit3, Pill, X, Check, AlertTriangle } from 'lucide-react'

const FORMS = ['tablet','capsule','liquid','injection','patch','drops']
const TIMES_OPTIONS = ['08:00','12:00','14:00','18:00','20:00','21:00']

const CAPSULE_PALETTES = [
  { left: '#38bdf8', right: '#fb923c' },
  { left: '#818cf8', right: '#f472b6' },
  { left: '#34d399', right: '#fde047' },
  { left: '#60a5fa', right: '#f87171' },
]

function MedForm({ initial, patientId, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    patient_id: patientId, name: '', dosage: '', form: 'tablet',
    instructions: '', color_code: '#8DB4D6', with_food: false,
    conflict_group: '', start_date: '', times_of_day: ['08:00']
  })
  const [saving, setSaving] = useState(false)

  const currentTimes = Array.isArray(form.times_of_day) ? form.times_of_day : []

  const toggleTime = (t) => {
    setForm(f => {
      const times = Array.isArray(f.times_of_day) ? f.times_of_day : []
      return {
        ...f,
        times_of_day: times.includes(t) ? times.filter(x => x !== t) : [...times, t]
      }
    })
  }

  const save = async () => {
    if (!form.name) return
    setSaving(true)
    try {
      if (initial?.id) await api.updateMedication(initial.id, form)
      else await api.addMedication({...form, patient_id: patientId})
      onSave()
    } catch(e) { alert(e.message) }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="card w-full max-w-md bg-white border-[#D6E6F2] shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6E6F2]">
          <h3 className="text-sm font-bold text-[#1A2F4C]">{initial ? 'Edit Medication' : 'Add Medication'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[#4A6B8F] hover:bg-[#F2F7FB]"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Medication Name *</label>
            <input className="input font-bold" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Metformin" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Dosage *</label>
              <input className="input font-mono" value={form.dosage} onChange={e=>setForm(f=>({...f,dosage:e.target.value}))} placeholder="e.g. 500mg" />
            </div>
            <div>
              <label className="label">Form</label>
              <select className="input" value={form.form} onChange={e=>setForm(f=>({...f,form:e.target.value}))}>
                {FORMS.map(ff => <option key={ff} value={ff}>{ff.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Instructions</label>
            <input className="input" value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} placeholder="e.g. Take with morning meal" />
          </div>
          <div>
            <label className="label">Daily Hours</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {TIMES_OPTIONS.map(t => (
                <button key={t} onClick={() => toggleTime(t)}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all
                    ${currentTimes.includes(t) ? 'bg-[#1A2F4C] text-white shadow-sm' : 'bg-[#F2F7FB] text-[#1A2F4C] border border-[#D6E6F2] hover:bg-[#D6E6F2]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" checked={!!form.with_food} onChange={e=>setForm(f=>({...f,with_food:e.target.checked}))}
              className="w-4 h-4 rounded text-[#8DB4D6] focus:ring-[#8DB4D6]" />
            <span className="text-xs font-semibold text-[#1A2F4C]">Administer with meals</span>
          </label>
        </div>
        <div className="flex gap-2.5 mt-6 pt-3 border-t border-[#D6E6F2]">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
          <button onClick={save} disabled={saving || !form.name} className="btn-primary flex-1 py-2 text-xs font-bold">
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add Medication'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Medications() {
  const { patientId } = useApp()
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    try {
      const m = await api.getMedications(patientId)
      setMeds(Array.isArray(m) ? m : [])
    } catch(e){
      setMeds([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (patientId) load()
    else setLoading(false)
  }, [patientId])

  const del = async (id) => {
    if (!confirm('Remove this medication?')) return
    await api.deleteMedication(id)
    load()
  }

  const safeMeds = Array.isArray(meds) ? meds : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Prescription Management</h1>
          <p className="text-xs text-[#4A6B8F]">Active prescriptions and scheduled administration hours</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
          <Plus size={14} /> Add Medication
        </button>
      </div>

      {loading ? <div className="card animate-pulse h-40 bg-[#F2F7FB]" /> : (
        <div className="card p-0 overflow-hidden border-[#D6E6F2]">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>3D Pill</th>
                <th>Medication</th>
                <th>Strength</th>
                <th>Form</th>
                <th>Hours</th>
                <th>Instructions</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {safeMeds.map((med, idx) => {
                const palette = CAPSULE_PALETTES[idx % CAPSULE_PALETTES.length]
                const dosageNumber = (med.dosage || '').split(' ')[0] || 'mg'
                const times = Array.isArray(med.times_of_day) 
                  ? med.times_of_day 
                  : typeof med.times_of_day === 'string' 
                    ? JSON.parse(med.times_of_day || '[]') 
                    : []

                return (
                  <tr key={med.id || idx} className="hover:bg-[#F2F7FB] transition-colors">
                    <td className="py-2.5">
                      <div className="pill-capsule-3d cursor-pointer" title={med.name}>
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
                      <div className="font-bold text-[#1A2F4C] text-xs">{med.name}</div>
                      <div className="text-[10px] text-[#4A6B8F]">
                        {med.with_food ? 'With meals' : 'Standard'}
                      </div>
                    </td>

                    <td className="font-mono text-[#1A2F4C] font-bold text-xs">{med.dosage}</td>
                    <td className="capitalize text-[#4A6B8F] text-xs">{med.form}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {times.map(t => (
                          <span key={t} className="badge bg-[#D6E6F2] text-[#1A2F4C] font-mono text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-xs text-[#4A6B8F] max-w-xs">{med.instructions}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => { setEditing(med); setShowForm(true) }} className="p-1.5 text-[#4A6B8F] hover:text-[#1A2F4C] mr-1">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => del(med.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <MedForm
          initial={editing}
          patientId={patientId}
          onSave={() => { setShowForm(false); setEditing(null); load() }}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
