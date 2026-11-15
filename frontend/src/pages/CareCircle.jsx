import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { UserPlus, Trash2, Users, X, Phone, Mail, Shield, CheckCircle, ShieldCheck, HeartHandshake } from 'lucide-react'

export default function CareCirclePage() {
  const { patientId, patient } = useApp()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient_id: patientId, name: '', email: '', role: 'family' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try { setMembers(await api.getCareCircle(patientId)) }
    catch(e){}
    setLoading(false)
  }
  useEffect(() => { load() }, [patientId])

  const add = async () => {
    if (!form.name || !form.email) return
    setSaving(true)
    try { 
      await api.addMember({ ...form, patient_id: patientId })
      setShowForm(false)
      setForm({ patient_id: patientId, name: '', email: '', role: 'family' })
      load()
    }
    catch(e) { alert(e.message) }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Revoke access for this authorized member?')) return
    await api.removeMember(id)
    load()
  }

  const primarySenior = {
    id: 1,
    name: patient?.name || 'Dorothy Williams',
    role: 'Primary Individual',
    email: patient?.emergency_contact_phone ? `Emergency Phone: ${patient.emergency_contact_phone}` : '+1-555-0199',
    is_active: true,
    invite_code: 'MRN-84920'
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Shared Ecosystem</span>
            <span className="text-xs text-emerald-800 font-mono">Multi-Stakeholder Circle</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">Care Circle & Authorized Caregivers</h1>
          <p className="text-xs text-emerald-800/80">Authorized guardians, nurses, and clinicians receiving automated alerts</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4 shadow-md">
          <UserPlus size={15} /> Authorize Care Member
        </button>
      </div>

      {loading ? <div className="card animate-pulse h-48 bg-emerald-50/50" /> : (
        <div className="space-y-5">
          <div className="card p-0 overflow-hidden">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Care Member</th>
                  <th>Ecosystem Role</th>
                  <th>Notification Channel</th>
                  <th>Access Authorization</th>
                  <th>Security Identifier</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Primary Patient */}
                <tr className="bg-emerald-50/60 font-semibold">
                  <td className="font-extrabold text-emerald-950 flex items-center gap-2 py-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>👵 {primarySenior.name}</span>
                  </td>
                  <td>
                    <span className="badge bg-emerald-900 text-white">Central Senior</span>
                  </td>
                  <td className="font-mono text-emerald-800 text-xs">{primarySenior.email}</td>
                  <td className="text-xs text-emerald-900">Full Healthcare Profile Owner</td>
                  <td className="font-mono text-xs text-emerald-700 font-bold">PIN: 1234</td>
                  <td className="text-right text-xs text-emerald-700/60 font-mono">Protected</td>
                </tr>

                {/* Connected members */}
                {members.filter(m => m.is_active).map(m => (
                  <tr key={m.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="font-bold text-emerald-950 text-xs">
                      {m.role === 'caretaker' ? '🩺 ' : m.role === 'doctor' ? '👨‍⚕️ ' : '👩 '}
                      {m.name}
                    </td>
                    <td>
                      <span className={`badge ${
                        m.role === 'caretaker' ? 'bg-teal-50 text-teal-800 border-teal-200' :
                        m.role === 'doctor' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="text-emerald-800 font-mono text-xs">{m.email}</td>
                    <td className="text-xs text-emerald-800/90">
                      Medication logs & Missed dose alerts
                    </td>
                    <td className="font-mono text-xs text-emerald-700">{m.invite_code?.slice(0, 8) || 'ACTIVE'}</td>
                    <td className="text-right">
                      <button 
                        onClick={() => remove(m.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Member Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm bg-white p-5 border-emerald-900/20 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/10">
              <h3 className="text-sm font-extrabold text-emerald-950">Authorize New Care Member</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-50"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Full Legal Name *</label>
                <input className="input font-bold" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dr. Susan Park" />
              </div>
              <div>
                <label className="label">Notification Email *</label>
                <input type="email" className="input font-mono" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="clinician@clinic.com" />
              </div>
              <div>
                <label className="label">Ecosystem Role</label>
                <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                  <option value="family">Family / Medical Proxy</option>
                  <option value="caretaker">Caretaker / Nurse</option>
                  <option value="doctor">Physician / Specialist</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5 pt-3 border-t border-emerald-100">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
              <button onClick={add} disabled={saving || !form.name || !form.email} className="btn-primary flex-1 py-2 text-xs font-bold">
                {saving ? 'Saving...' : 'Authorize Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
