import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { UserPlus, Trash2, X, Users } from 'lucide-react'

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
    if (!confirm('Remove this member?')) return
    await api.removeMember(id)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Care Circle & Family Access</h1>
          <p className="text-xs text-[#4A6B8F]">Authorized proxies and caregivers receiving automated alert emails</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4 shadow-sm">
          <UserPlus size={14} /> Add Caregiver
        </button>
      </div>

      {loading ? <div className="card animate-pulse h-40 bg-[#F2F7FB]" /> : (
        <div className="card p-0 overflow-hidden">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Authorization</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Primary Patient */}
              <tr className="bg-[#D6E6F2]/30 font-semibold">
                <td className="font-bold text-[#1A2F4C] py-3">
                  👵 {patient?.name || 'Dorothy Williams'}
                </td>
                <td><span className="badge bg-[#1A2F4C] text-white">Central Senior</span></td>
                <td className="font-mono text-xs text-[#4A6B8F]">{patient?.emergency_contact_phone || '+1-555-0199'}</td>
                <td className="text-xs text-[#1A2F4C]">Healthcare Profile Owner</td>
                <td className="text-right text-xs text-[#4A6B8F]">Protected</td>
              </tr>

              {/* Members */}
              {members.filter(m => m.is_active).map(m => (
                <tr key={m.id} className="hover:bg-[#F2F7FB] transition-colors">
                  <td className="font-bold text-[#1A2F4C] text-xs">
                    {m.role === 'caretaker' ? '🩺 ' : m.role === 'doctor' ? '👨‍⚕️ ' : '👩 '}
                    {m.name}
                  </td>
                  <td>
                    <span className="badge bg-[#D6E6F2] text-[#1A2F4C]">
                      {m.role}
                    </span>
                  </td>
                  <td className="text-[#4A6B8F] font-mono text-xs">{m.email}</td>
                  <td className="text-xs text-[#4A6B8F]">Medication alerts & logs</td>
                  <td className="text-right">
                    <button 
                      onClick={() => remove(m.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="card w-full max-w-sm bg-white p-5 border-[#D6E6F2] shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6E6F2]">
              <h3 className="text-sm font-bold text-[#1A2F4C]">Add Caregiver Member</h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-[#4A6B8F] hover:bg-[#F2F7FB]"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Full Name *</label>
                <input className="input font-bold" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Sarah Williams" />
              </div>
              <div>
                <label className="label">Notification Email *</label>
                <input type="email" className="input font-mono" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="sarah@family.com" />
              </div>
              <div>
                <label className="label">Relationship / Role</label>
                <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                  <option value="family">Family Caregiver</option>
                  <option value="caretaker">Caretaker / Nurse</option>
                  <option value="doctor">Physician</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5 pt-3 border-t border-[#D6E6F2]">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
              <button onClick={add} disabled={saving || !form.name || !form.email} className="btn-primary flex-1 py-2 text-xs font-bold">
                {saving ? 'Adding...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
