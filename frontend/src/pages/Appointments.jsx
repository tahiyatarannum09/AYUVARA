import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Plus, Trash2, Edit3, Calendar, X, CheckCircle, Clock, Sparkles } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm">
      <div className="card w-full max-w-md bg-white border-emerald-900/20 shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/10">
          <h3 className="text-sm font-extrabold text-emerald-950">{initial ? 'Modify Appointment' : 'Schedule Clinical Consultation'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-50"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Clinician / Attending Physician *</label>
            <input className="input font-bold" value={form.doctor_name} onChange={e=>setForm(f=>({...f,doctor_name:e.target.value}))} placeholder="e.g. Dr. Priya Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Medical Specialty</label>
              <input className="input" value={form.specialty} onChange={e=>setForm(f=>({...f,specialty:e.target.value}))} placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className="label">Hospital / Practice</label>
              <input className="input" value={form.clinic} onChange={e=>setForm(f=>({...f,clinic:e.target.value}))} placeholder="Helix Medical Center" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Consultation Date *</label>
              <input type="date" className="input font-mono" value={form.appt_date} onChange={e=>setForm(f=>({...f,appt_date:e.target.value}))} />
            </div>
            <div>
              <label className="label">Scheduled Time</label>
              <input type="time" className="input font-mono" value={form.appt_time} onChange={e=>setForm(f=>({...f,appt_time:e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="label">Clinic Address / Suite</label>
            <input className="input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Building B, Suite 402" />
          </div>
          <div>
            <label className="label">Fasting Requirements / Prep Instructions</label>
            <textarea className="input h-18 resize-none" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. 10-hour fasting blood glucose test, bring recent telemetry logs" />
          </div>
        </div>
        <div className="flex gap-2.5 mt-6 pt-3 border-t border-emerald-100">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
          <button onClick={save} disabled={saving || !form.doctor_name || !form.appt_date} className="btn-primary flex-1 py-2 text-xs font-bold">
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Confirm Appointment'}
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
    if (!confirm('Remove this appointment record?')) return
    await api.deleteAppointment(id)
    load()
  }

  const complete = async (a) => {
    await api.updateAppointment(a.id, { is_completed: !a.is_completed })
    load()
  }

  const upcoming = appts.filter(a => !a.is_completed).sort((a,b) => a.appt_date.localeCompare(b.appt_date))
  const past = appts.filter(a => a.is_completed)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Care Coordination</span>
            <span className="text-xs text-emerald-800 font-mono">{upcoming.length} Upcoming Scheduled</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">Clinical Consultations & Specialist Visits</h1>
          <p className="text-xs text-emerald-800/80">Proactive doctor appointments, preparation notes, and clinical follow-ups</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4 shadow-md">
          <Plus size={15} /> Schedule Consultation
        </button>
      </div>

      {loading ? <div className="card animate-pulse h-48 bg-emerald-50/50" /> : (
        <div className="space-y-5">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                Upcoming Doctor Visits ({upcoming.length})
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">Auto Email Reminders Enabled</span>
            </div>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Physician</th>
                  <th>Specialty</th>
                  <th>Facility / Address</th>
                  <th>Clinical Preparation</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(a => (
                  <tr key={a.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="font-mono font-bold text-emerald-950 whitespace-nowrap">
                      {a.appt_date} {a.appt_time && `at ${a.appt_time}`}
                    </td>
                    <td className="font-extrabold text-emerald-950">Dr. {a.doctor_name}</td>
                    <td className="text-emerald-800 font-medium">{a.specialty}</td>
                    <td>
                      <div className="text-emerald-950 font-bold">{a.clinic}</div>
                      <div className="text-[10px] text-emerald-700/80">{a.address}</div>
                    </td>
                    <td className="text-xs text-emerald-800/90 italic">{a.notes || 'Standard clinical review'}</td>
                    <td>
                      <span className="badge badge-subtle text-[10px]">
                        Confirmed
                      </span>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => complete(a)} className="text-xs text-emerald-700 hover:text-emerald-950 font-bold mr-3 underline">
                        Mark Done
                      </button>
                      <button onClick={() => { setEditing(a); setShowForm(true) }} className="p-1.5 text-emerald-700 hover:text-emerald-950 mr-1">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => del(a.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {upcoming.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-emerald-800/60 text-xs">
                      No upcoming doctor consultations recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {past.length > 0 && (
            <div className="card p-0 overflow-hidden opacity-85">
              <div className="px-4 py-2.5 bg-emerald-50/40 border-b border-emerald-100 text-xs font-bold uppercase text-emerald-900 tracking-wider">
                Completed Consultations History ({past.length})
              </div>
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Physician</th>
                    <th>Specialty</th>
                    <th>Facility</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map(a => (
                    <tr key={a.id}>
                      <td className="font-mono text-emerald-800">{a.appt_date}</td>
                      <td className="font-bold text-emerald-950">Dr. {a.doctor_name}</td>
                      <td className="text-emerald-800">{a.specialty}</td>
                      <td className="text-emerald-800/80">{a.clinic}</td>
                      <td>
                        <span className="badge bg-emerald-50 text-emerald-800 border-emerald-200">Completed</span>
                      </td>
                      <td className="text-right">
                        <button onClick={() => complete(a)} className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline">
                          Reopen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
