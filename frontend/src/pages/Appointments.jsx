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
    try { setAppts(await api.getAppointments(patientId)) }
    catch(e){}
    setLoading(false)
  }
  useEffect(() => { load() }, [patientId])

  const del = async (id) => {
    if (!confirm('Remove this appointment?')) return
    await api.deleteAppointment(id)
    load()
  }

  const complete = async (a) => {
    await api.updateAppointment(a.id, { is_completed: !a.is_completed })
    load()
  }

  const upcoming = appts.filter(a => !a.is_completed)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Doctor Appointments</h1>
          <p className="text-xs text-[#4A6B8F]">Upcoming medical visits and specialist checkups</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4 shadow-sm">
          <Plus size={14} /> Schedule Visit
        </button>
      </div>

      {loading ? <div className="card animate-pulse h-40 bg-[#F2F7FB]" /> : (
        <div className="card p-0 overflow-hidden">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Physician</th>
                <th>Specialty</th>
                <th>Facility</th>
                <th>Prep Instructions</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(a => (
                <tr key={a.id} className="hover:bg-[#F2F7FB] transition-colors">
                  <td className="font-mono font-bold text-[#1A2F4C] whitespace-nowrap">
                    {a.appt_date} {a.appt_time && `at ${a.appt_time}`}
                  </td>
                  <td className="font-bold text-[#1A2F4C]">Dr. {a.doctor_name}</td>
                  <td className="text-[#4A6B8F]">{a.specialty}</td>
                  <td className="text-[#1A2F4C]">{a.clinic}</td>
                  <td className="text-xs text-[#4A6B8F] italic">{a.notes || 'Routine checkup'}</td>
                  <td className="text-right whitespace-nowrap">
                    <button onClick={() => complete(a)} className="text-xs text-[#38bdf8] hover:text-[#0284c7] font-bold mr-3">
                      Mark Done
                    </button>
                    <button onClick={() => { setEditing(a); setShowForm(true) }} className="p-1.5 text-[#4A6B8F] hover:text-[#1A2F4C] mr-1">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => del(a.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {upcoming.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#4A6B8F] text-xs">
                    No upcoming doctor consultations recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
