import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { UserPlus, Trash2, X, Users, Phone, Mail, Shield } from 'lucide-react'

export default function CareCirclePage() {
  const { patientId, patient } = useApp()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient_id: patientId, name: '', email: '', phone: '', role: 'family' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.getCareCircle(patientId)
      setMembers(Array.isArray(res) ? res : [])
    } catch(e) {
      setMembers([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (patientId) load()
    else setLoading(false)
  }, [patientId])

  const add = async () => {
    if (!form.name || !form.email) return
    setSaving(true)
    try { 
      await api.addMember({ ...form, patient_id: patientId })
      setShowForm(false)
      setForm({ patient_id: patientId, name: '', email: '', phone: '', role: 'family' })
      load()
    } catch(e) {
      alert(e.message)
    }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Remove this member from the care circle?')) return
    await api.removeMember(id)
    load()
  }

  const safeMembers = (Array.isArray(members) ? members : []).filter(m => m.is_active !== false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Care Circle &amp; Family Access</h1>
          <p className="text-xs text-[#4A6B8F]">Authorized proxies and caregivers receiving automated alert emails and compliance digests</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
          <UserPlus size={14} /> Add Caregiver
        </button>
      </div>

      {loading ? (
        <div className="card animate-pulse h-40 bg-[#F2F7FB]" />
      ) : (
        <div className="card p-0 overflow-hidden border-[#D6E6F2]">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Name &amp; Role</th>
                <th>Relationship</th>
                <th>Contact Details</th>
                <th>Notification Scope</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Primary Patient */}
              <tr className="bg-[#D6E6F2]/30 font-semibold">
                <td className="font-bold text-[#1A2F4C] py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👵</span>
                    <div>
                      <div className="text-xs font-bold text-[#1A2F4C]">{patient?.name || 'Dorothy Williams'}</div>
                      <span className="text-[10px] text-[#4A6B8F]">Senior Patient</span>
                    </div>
                  </div>
                </td>
                <td><span className="badge bg-[#1A2F4C] text-white text-[10px]">Primary Subject</span></td>
                <td className="font-mono text-xs text-[#4A6B8F]">
                  {patient?.emergency_contact_phone || '+1 (555) 234-5678'}
                </td>
                <td className="text-xs text-[#1A2F4C] font-medium">Healthcare Profile Owner</td>
                <td className="text-right text-xs text-[#4A6B8F] font-bold">Protected</td>
              </tr>

              {/* Members */}
              {safeMembers.map(m => (
                <tr key={m.id} className="hover:bg-[#F2F7FB] transition-colors">
                  <td className="font-bold text-[#1A2F4C] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {m.role === 'caretaker' ? '🩺' : m.role === 'physician' || m.role === 'doctor' ? '👨‍⚕️' : '👨‍👩‍👧'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#1A2F4C]">{m.name}</div>
                        <span className="capitalize text-[10px] text-[#4A6B8F]">{m.role}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-[#D6E6F2] text-[#1A2F4C] font-semibold text-[10px]">
                      {m.relationship || m.role}
                    </span>
                  </td>
                  <td className="text-[#4A6B8F] font-mono text-xs">
                    <div>{m.email}</div>
                    {m.phone && <div className="text-[11px] text-[#4A6B8F]/80">{m.phone}</div>}
                  </td>
                  <td className="text-xs text-[#4A6B8F]">
                    {m.is_emergency ? (
                      <span className="text-rose-600 font-bold">🚨 Emergency &amp; Daily Digests</span>
                    ) : (
                      'Medication alerts & logs'
                    )}
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => remove(m.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50"
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
          <div className="card w-full max-w-md bg-white border-[#D6E6F2] shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6E6F2]">
              <h3 className="text-sm font-bold text-[#1A2F4C]">Add Care Circle Member</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-[#4A6B8F] hover:bg-[#F2F7FB]">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Full Name *</label>
                <input 
                  className="input font-bold" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="e.g. James Williams" 
                />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input 
                  type="email" 
                  className="input font-mono" 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                  placeholder="e.g. james@example.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Phone</label>
                  <input 
                    className="input font-mono" 
                    value={form.phone} 
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select 
                    className="input capitalize" 
                    value={form.role} 
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  >
                    <option value="family">Family</option>
                    <option value="caretaker">Caretaker</option>
                    <option value="physician">Physician</option>
                    <option value="neighbor">Neighbor</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5 pt-3 border-t border-[#D6E6F2]">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2 text-xs">
                Cancel
              </button>
              <button 
                onClick={add} 
                disabled={saving || !form.name || !form.email} 
                className="btn-primary flex-1 py-2 text-xs font-bold"
              >
                {saving ? 'Adding...' : 'Add Caregiver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
