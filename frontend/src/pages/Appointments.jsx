import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Plus, Trash2, Edit3, Calendar, X, CheckCircle } from 'lucide-react'

function ApptForm({ initial, patientId, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    patient_id: patientId, doctor_name: '', specialty: '',
    clinic: '', address: '', appt_date: '', appt_time: '', notes: ''
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.doctor_name || !form.appt_date) return
    setSaving(true)
    try {
      if (initial?.id) await api.updateAppointment(initial.id, form)
      else await api.addAppointment({...form, patient_id: patientId})
      onSave()
    } catch(e) { alert(e.message) }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="card w-full max-w-md bg-white border-[#D6E6F2] shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6E6F2]">
          <h3 className="text-sm font-bold text-[#1A2F4C]">{initial ? 'Edit Consultation' : 'Schedule Consultation'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[#4A6B8F] hover:bg-[#F2F7FB]"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Physician Name *</label>
            <input className="input font-bold" value={form.doctor_name} onChange={e=>setForm(f=>({...f,doctor_name:e.target.value}))} placeholder="e.g. Dr. Robert Chen" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Specialty</label>
              <input className="input" value={form.specialty} onChange={e=>setForm(f=>({...f,specialty:e.target.value}))} placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className="label">Clinic / Hospital</label>
              <input className="input" value={form.clinic} onChange={e=>setForm(f=>({...f,clinic:e.target.value}))} placeholder="Health Medical Center" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input font-mono" value={form.appt_date} onChange={e=>setForm(f=>({...f,appt_date:e.target.value}))} />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" className="input font-mono" value={form.appt_time} onChange={e=>setForm(f=>({...f,appt_time:e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="label">Preparation Notes</label>
            <input className="input" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Fasting glucose check" />
          </div>
        </div>
        <div className="flex gap-2.5 mt-5 pt-3 border-t border-[#D6E6F2]">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
          <button onClick={save} disabled={saving || !form.doctor_name || !form.appt_date} className="btn-primary flex-1 py-2 text-xs font-bold">
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Appointments() {
  const { patientId } = useApp()
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    try { 
      const res = await api.getAppointments(patientId)
      setAppts(Array.isArray(res) ? res : [])
    }
    catch(e){
      setAppts([])
    }
    setLoading(false)
  }
  useEffect(() => { 
    if (patientId) load() 
    else setLoading(false)
  }, [patientId])

  const del = async (id) => {
    if (!confirm('Remove this appointment?')) return
    await api.deleteAppointment(id)
    load()
  }

  const complete = async (a) => {
    await api.updateAppointment(a.id, { is_completed: !a.is_completed })
    load()
  }

  const safeAppts = Array.isArray(appts) ? appts : []
  const upcoming = safeAppts.filter(a => !a?.is_completed)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Physician Appointments</h1>
          <p className="text-xs text-[#4A6B8F]">Upcoming medical consults, checkups, and clinical calendar</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
          <Plus size={14} /> Schedule Appointment
        </button>
      </div>

      {loading ? (
        <div className="card animate-pulse h-40 bg-[#F2F7FB]" />
      ) : safeAppts.length === 0 ? (
        <div className="card p-10 text-center bg-white border border-[#D6E6F2]">
          <Calendar size={36} className="text-[#8DB4D6] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-[#1A2F4C]">No upcoming consultations scheduled</p>
          <p className="text-xs text-[#4A6B8F] mt-1">Tap Schedule Appointment to record upcoming doctor visits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeAppts.map(a => (
            <div 
              key={a.id} 
              className={`card p-4 border transition-all ${
                a.is_completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-[#D6E6F2] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👨‍⚕️</span>
                    <h3 className="font-bold text-sm text-[#1A2F4C]">{a.doctor_name}</h3>
                  </div>
                  <div className="text-xs text-[#4A6B8F] mt-0.5">{a.specialty} · {a.clinic}</div>
                </div>
                <span className={`badge ${a.is_completed ? 'bg-slate-200 text-slate-700' : 'bg-[#D6E6F2] text-[#1A2F4C]'}`}>
                  {a.is_completed ? 'Completed' : 'Upcoming'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#D6E6F2] flex items-center justify-between text-xs">
                <div className="font-mono text-[#1A2F4C] font-semibold">
                  📅 {a.appt_date} {a.appt_time && `at ${a.appt_time}`}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => complete(a)} 
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                      a.is_completed ? 'border-slate-300 text-slate-600' : 'border-emerald-300 text-emerald-700 bg-emerald-50'
                    }`}
                  >
                    <CheckCircle size={13} />
                    <span>{a.is_completed ? 'Reopen' : 'Done'}</span>
                  </button>
                  <button onClick={() => del(a.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {a.notes && (
                <div className="mt-2 text-[11px] text-[#4A6B8F] bg-[#F2F7FB] p-2 rounded-lg">
                  Notes: {a.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ApptForm
          initial={editing}
          patientId={patientId}
          onSave={() => { setShowForm(false); setEditing(null); load() }}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
