import { useState, useEffect, useRef } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Printer } from 'lucide-react'

export default function DoctorPrepPage() {
  const { patientId } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    api.getDoctorPrep(patientId).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [patientId])

  const print = () => {
    const content = printRef.current?.innerHTML
    const w = window.open('', '_blank')
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
  if (!data || data.error) return <div className="card p-6 text-[#4A6B8F] text-center">Unable to load summary.</div>

  const { patient, medications, wellness_summary: ws } = data

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Doctor Visit Dossier</h1>
          <p className="text-xs text-[#4A6B8F]">Summary of compliance, active medications, and vitals for consultation</p>
        </div>
        <button onClick={print} className="btn-primary text-xs py-2 px-4 shadow-sm">
          <Printer size={14} /> Print / Export Record
        </button>
      </div>

      <div ref={printRef} className="space-y-4 bg-white p-6 rounded-2xl border border-[#D6E6F2] shadow-sm">
        <div className="border-b border-[#1A2F4C] pb-3 flex justify-between items-start">
          <div>
            <div className="text-base font-bold text-[#1A2F4C]">CLINICAL CONSULTATION REPORT</div>
            <div className="text-xs text-[#4A6B8F] mt-0.5">Patient: <strong>{patient.name}</strong> · DOB: {patient.dob}</div>
          </div>
          <div className="text-right text-xs text-[#4A6B8F] font-mono">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Ayuvara Autonomous Telemetry</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2]">
            <div className="text-[10px] font-bold uppercase text-[#4A6B8F] mb-1.5">Profile</div>
            <div>Blood: <strong>{patient.blood_type || 'O+'}</strong> · Allergies: <strong className="text-rose-600">{patient.allergies || 'Penicillin'}</strong></div>
            <div className="mt-1 text-[#4A6B8F]">Diagnoses: {patient.medical_notes}</div>
          </div>

          <div className="p-3 bg-[#F2F7FB] rounded-xl border border-[#D6E6F2]">
            <div className="text-[10px] font-bold uppercase text-[#4A6B8F] mb-1.5">7-Day Telemetry</div>
            <div>Compliance: <strong className="text-[#38bdf8] font-bold">{ws.adherence_7d_pct}%</strong> ({ws.doses_taken}/{ws.total_doses} doses)</div>
            <div className="mt-1 text-[#4A6B8F]">Pain Scale: {ws.avg_pain_7d != null ? `${ws.avg_pain_7d} / 10` : 'None logged'}</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase text-[#1A2F4C] mb-2">Prescribed Regimen ({medications.length})</div>
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Drug</th>
                <th>Dosage</th>
                <th>Form</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m, i) => (
                <tr key={i}>
                  <td className="font-bold text-[#1A2F4C]">{m.name}</td>
                  <td className="font-mono text-xs">{m.dosage}</td>
                  <td className="capitalize text-[#4A6B8F]">{m.form}</td>
                  <td>{m.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
