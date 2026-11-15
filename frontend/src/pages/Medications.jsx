import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Plus, Trash2, Edit3, Pill, X, Check, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react'

const FORMS = ['tablet','capsule','liquid','injection','patch','drops']
const TIMES_OPTIONS = ['06:00','07:00','08:00','09:00','10:00','12:00','13:00','14:00','18:00','20:00','21:00','22:00']
const CONFLICT_GROUPS = ['','anticoagulant','nsaid','antiplatelet','maoi','ssri','snri','corticosteroid','stimulant']

const CAPSULE_PALETTES = [
  { left: '#059669', right: '#fef08a', leftText: '#ffffff', rightText: '#064e3b' },
  { left: '#0284c7', right: '#ffffff', leftText: '#ffffff', rightText: '#0369a1' },
  { left: '#dc2626', right: '#fee2e2', leftText: '#ffffff', rightText: '#991b1b' },
  { left: '#7c3aed', right: '#ede9fe', leftText: '#ffffff', rightText: '#5b21b6' },
  { left: '#ea580c', right: '#ffedd5', leftText: '#ffffff', rightText: '#9a3412' },
]

function MedForm({ initial, patientId, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    patient_id: patientId, name: '', dosage: '', form: 'tablet',
    instructions: '', color_code: '#059669', with_food: false,
    conflict_group: '', start_date: '', times_of_day: []
  })
  const [saving, setSaving] = useState(false)

  const toggleTime = (t) => setForm(f => ({...f,
    times_of_day: f.times_of_day.includes(t) ? f.times_of_day.filter(x=>x!==t) : [...f.times_of_day, t]
  }))

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm">
      <div className="card w-full max-w-md bg-white border-emerald-900/20 shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/10">
          <h3 className="text-sm font-extrabold text-emerald-950">{initial ? 'Modify Prescription Chart' : 'Add New Prescription'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-50"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Drug Brand / Generic Molecule Name *</label>
            <input className="input font-bold" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Metformin Hydrochloride" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Dosage / Strength *</label>
              <input className="input font-mono" value={form.dosage} onChange={e=>setForm(f=>({...f,dosage:e.target.value}))} placeholder="e.g. 500mg" />
            </div>
            <div>
              <label className="label">Dosage Form</label>
              <select className="input" value={form.form} onChange={e=>setForm(f=>({...f,form:e.target.value}))}>
                {FORMS.map(ff => <option key={ff} value={ff}>{ff.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Administration Instructions</label>
            <input className="input" value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} placeholder="e.g. Ingest with water immediately following morning meal" />
          </div>
          <div>
            <label className="label">Pharmacological Conflict Category</label>
            <select className="input" value={form.conflict_group} onChange={e=>setForm(f=>({...f,conflict_group:e.target.value}))}>
              {CONFLICT_GROUPS.map(g => <option key={g} value={g}>{g ? g.toUpperCase() : '— NONE / BENIGN —'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Daily Dosing Schedule (Hours)</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {TIMES_OPTIONS.map(t => (
                <button key={t} onClick={() => toggleTime(t)}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all
                    ${form.times_of_day.includes(t) ? 'bg-emerald-800 text-white shadow-sm' : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" checked={form.with_food} onChange={e=>setForm(f=>({...f,with_food:e.target.checked}))}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
            <span className="text-xs font-semibold text-emerald-900">Ingest with food / meals</span>
          </label>
        </div>
        <div className="flex gap-2.5 mt-6 pt-3 border-t border-emerald-100">
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
  const [conflicts, setConflicts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    try {
      const [m, c] = await Promise.all([api.getMedications(patientId), api.getConflicts(patientId)])
      setMeds(m); setConflicts(c)
    } catch(e){}
    setLoading(false)
  }
  useEffect(() => { load() }, [patientId])

  const del = async (id) => {
    if (!confirm('Are you sure you want to deactivate and remove this prescription?')) return
    await api.deleteMedication(id)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Pharmacotherapy</span>
            <span className="text-xs text-emerald-800 font-mono">5 Active Prescriptions</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">Patient Medication Regimen</h1>
          <p className="text-xs text-emerald-800/80">Active prescription schedules, conflict verification, and daily timetable</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4 shadow-md">
          <Plus size={15} /> Add Prescription
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="card p-4 bg-amber-50/90 border-amber-300 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider">Active Pharmacological Interaction Advisories ({conflicts.length})</div>
              {conflicts.map((c, i) => (
                <div key={i} className="text-xs text-amber-900 mt-1 font-medium">• {c.warning}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="card animate-pulse h-48 bg-emerald-50/50" /> : (
        <div className="card p-0 overflow-hidden">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>3D Pill</th>
                <th>Drug Name</th>
                <th>Strength</th>
                <th>Form</th>
                <th>Administration Hours</th>
                <th>Directions</th>
                <th>Conflict Class</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meds.map((med, idx) => {
                const palette = CAPSULE_PALETTES[idx % CAPSULE_PALETTES.length]
                const dosageNumber = (med.dosage || '').split(' ')[0] || 'mg'

                return (
                  <tr key={med.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2.5">
                      <div className="pill-capsule-3d cursor-pointer" title={med.name}>
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[9px] font-black"
                          style={{ backgroundColor: palette.left, color: palette.leftText }}
                        >
                          Rx
                        </div>
                        <div 
                          className="w-1/2 h-full flex items-center justify-center text-[8px] font-extrabold"
                          style={{ backgroundColor: palette.right, color: palette.rightText }}
                        >
                          {dosageNumber.slice(0, 4)}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-extrabold text-emerald-950 text-xs">{med.name}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {med.with_food ? 'Ingest with meal' : 'Standard regimen'}
                      </div>
                    </td>

                    <td className="font-mono text-emerald-900 font-bold text-xs">{med.dosage}</td>
                    <td className="capitalize text-emerald-800 text-xs font-semibold">{med.form}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {med.times_of_day.map(t => (
                          <span key={t} className="badge bg-emerald-50 text-emerald-900 border-emerald-200 font-mono text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-xs text-emerald-800/80 max-w-xs">{med.instructions}</td>
                    <td>
                      {med.conflict_group ? (
                        <span className="badge bg-amber-50 text-amber-900 border-amber-200 text-[10px]">
                          {med.conflict_group}
                        </span>
                      ) : (
                        <span className="text-emerald-800/40 font-mono text-[10px]">—</span>
                      )}
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => { setEditing(med); setShowForm(true) }} className="p-1.5 text-emerald-700 hover:text-emerald-950 mr-1">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => del(med.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                        <Trash2 size={15} />
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
