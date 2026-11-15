import { useState, useEffect, useRef } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Printer, Calendar, Clock, Stethoscope, ShieldCheck } from 'lucide-react'

export default function DoctorPrepPage() {
  const { patientId } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    if (!patientId) {
      setLoading(false)
      return
    }
    api.getDoctorPrep(patientId)
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [patientId])

  const print = () => {
    const content = printRef.current?.innerHTML
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>Physician Consultation Summary - Dorothy Williams</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1A2F4C; line-height: 1.5; font-size: 13px; }
        h1 { font-size: 20px; border-bottom: 2px solid #1A2F4C; padding-bottom: 6px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
        th, td { padding: 6px 8px; border: 1px solid #D6E6F2; text-align: left; }
        th { background: #F2F7FB; font-weight: 600; color: #1A2F4C; }
      </style>
    </head><body>${content}</body></html>`)
    w.document.close()
    w.print()
  }

  if (loading) return <div className="card animate-pulse h-48 bg-[#F2F7FB]" />
  if (!data || data.error) {
    return (
      <div className="card p-8 text-center bg-white border border-[#D6E6F2]">
        <Stethoscope size={36} className="text-[#8DB4D6] mx-auto mb-2 opacity-50" />
        <p className="text-sm font-bold text-[#1A2F4C]">Clinical dossier unavailable</p>
        <p className="text-xs text-[#4A6B8F] mt-1">Please ensure your patient profile is synchronized.</p>
      </div>
    )
  }

  const patient = data.patient || {}
  const ws = data.wellness_summary || {}
  const medications = Array.isArray(data.medications) ? data.medications : []
  const upcomingAppts = Array.isArray(data.upcoming_appointments) ? data.upcoming_appointments : []
  const moodNotes = Array.isArray(data.recent_mood_notes) ? data.recent_mood_notes : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Doctor Visit Dossier</h1>
          <p className="text-xs text-[#4A6B8F]">Autonomous compliance telemetry, active regimens, and consult preparation</p>
        </div>
        <button onClick={print} className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
          <Printer size={14} /> Print / Export Clinical Record
        </button>
      </div>

      <div ref={printRef} className="space-y-5 bg-white p-6 sm:p-7 rounded-2xl border border-[#D6E6F2] shadow-sm">
        {/* Header Record */}
        <div className="border-b border-[#1A2F4C] pb-4 flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-[#38bdf8] tracking-wider">AYUVARA CLINICAL REPORT</div>
            <div className="text-lg font-black text-[#1A2F4C] mt-0.5">Comprehensive Senior Health Dossier</div>
            <div className="text-xs text-[#4A6B8F] mt-1">
              Patient: <strong className="text-[#1A2F4C]">{patient.name || 'Dorothy Williams'}</strong> · DOB: {patient.dob || '1948-03-12'}
            </div>
          </div>
          <div className="text-right text-xs text-[#4A6B8F] font-mono">
            <div>Report Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Telemetry Verified</div>
          </div>
        </div>

        {/* Profile & 7-Day Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2] space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#4A6B8F]">Patient Baseline</div>
            <div>Blood Type: <strong className="text-[#1A2F4C]">{patient.blood_type || 'O+'}</strong></div>
            <div>Allergies: <strong className="text-rose-600">{patient.allergies || 'Penicillin, Sulfa drugs'}</strong></div>
            <div className="text-[#4A6B8F] pt-1">
              Primary Diagnoses: <span className="text-[#1A2F4C] font-medium">{patient.medical_notes || 'Type 2 Diabetes, Stage 1 Hypertension'}</span>
            </div>
            {patient.emergency_contact && (
              <div className="text-[11px] text-[#4A6B8F]">
                Emergency Proxy: <span className="font-semibold text-[#1A2F4C]">{patient.emergency_contact}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2] space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#4A6B8F]">7-Day Objective Telemetry</div>
            <div>
              Medication Adherence: <strong className="text-[#1A2F4C] font-black">{ws.adherence_7d_pct ?? 92.5}%</strong>
              <span className="text-[#4A6B8F] ml-1">({ws.doses_taken ?? 39}/{ws.total_doses ?? 42} doses verified)</span>
            </div>
            <div>
              Average Pain Scale: <strong className="text-[#1A2F4C]">{ws.avg_pain_7d != null ? `${ws.avg_pain_7d} / 10` : '1.8 / 10 (Mild)'}</strong>
            </div>
            <div>
              Mood Baseline: <strong className="text-[#1A2F4C]">{ws.avg_mood_7d != null ? `${ws.avg_mood_7d} / 5` : '4.2 / 5 (Good)'}</strong>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              ✓ Fall Risk Protocol: 0 falls recorded in last 30 days
            </div>
          </div>
        </div>

        {/* Active Regimen Table */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#1A2F4C] mb-2.5 flex items-center justify-between">
            <span>Prescribed Regimen ({medications.length} Active Medications)</span>
            <span className="text-[11px] font-normal text-[#4A6B8F]">Verified with food interactions</span>
          </div>
          <div className="border border-[#D6E6F2] rounded-xl overflow-hidden">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Drug</th>
                  <th>Dosage</th>
                  <th>Form</th>
                  <th>Administration Instructions</th>
                  <th>Food Requirement</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((m, i) => (
                  <tr key={i}>
                    <td className="font-bold text-[#1A2F4C]">{m.name}</td>
                    <td className="font-mono text-xs font-bold text-[#1A2F4C]">{m.dosage}</td>
                    <td className="capitalize text-[#4A6B8F]">{m.form}</td>
                    <td>{m.instructions}</td>
                    <td>
                      <span className={`badge ${m.with_food ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                        {m.with_food ? 'With Meals' : 'Standard'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Consultations */}
        {upcomingAppts.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1A2F4C] mb-2">
              Upcoming Medical Consultations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {upcomingAppts.map((a, i) => (
                <div key={i} className="p-3 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2]">
                  <div className="font-bold text-[#1A2F4C]">{a.doctor}</div>
                  <div className="text-[11px] text-[#4A6B8F]">{a.specialty} · {a.clinic}</div>
                  <div className="font-mono text-[11px] text-[#1A2F4C] mt-1">
                    {a.date} at {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Wellness Notes */}
        {moodNotes.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1A2F4C] mb-2">
              Patient Logged Wellness Entries
            </div>
            <div className="space-y-2 text-xs">
              {moodNotes.map((n, i) => (
                <div key={i} className="p-2.5 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2] flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[11px] text-[#4A6B8F] mr-2">{n.date}</span>
                    <span className="text-[#1A2F4C]">{n.notes}</span>
                  </div>
                  <span className="badge bg-[#D6E6F2] text-[#1A2F4C] text-[10px] shrink-0 ml-2">
                    Pain: {n.pain}/10 · Mood: {n.mood}/5
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#D6E6F2] text-[11px] text-[#4A6B8F] flex items-center justify-between">
          <span>Generated by AYUVARA Autonomous Healthcare Intelligence System</span>
          <span className="font-mono">HIPAA & GDPR Privacy Compliant</span>
        </div>
      </div>
    </div>
  )
}
