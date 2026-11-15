import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import TodayDoses from '../components/TodayDoses'
import { 
  Calendar, AlertTriangle, Users, Bell, Compass, 
  Video, ChevronRight, Sparkles, CheckCircle2, Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { patientId, patient } = useApp()
  const [appts, setAppts] = useState([])
  const [conflicts, setConflicts] = useState([])
  const [doses, setDoses] = useState([])
  const [loc, setLoc] = useState(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!patientId) return
    api.getAppointments(patientId).then(setAppts).catch(() => {})
    api.getConflicts(patientId).then(setConflicts).catch(() => {})
    api.getTodayAdherence(patientId).then(setDoses).catch(() => {})
    fetch(`/api/location/${patientId}/current`).then(r => r.json()).then(setLoc).catch(() => {})
  }, [patientId, refresh])

  const taken = doses.filter(d => d.status === 'taken').length
  const total = doses.length
  const adherencePct = total ? Math.round((taken / total) * 100) : 0
  const nextPending = doses.find(d => d.status === 'pending')
  const nextAppt = appts.find(a => !a.is_completed)

  return (
    <div className="space-y-6">
      {/* ── CLEAN AIRY HERO BANNER ───────────────────────────────────────── */}
      <div className="card p-6 bg-gradient-to-r from-[#D6E6F2]/60 via-[#F2F7FB] to-white border-[#8DB4D6]/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#1A2F4C] text-xs font-semibold mb-2 border border-[#8DB4D6]/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>Autonomous Health Guardian Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A2F4C]">
            Welcome, {patient?.name || 'Dorothy'}
          </h1>
          <p className="text-xs text-[#4A6B8F] mt-0.5">
            Everything is on schedule. Next medication dose is at {nextPending?.scheduled_time || '8:00 PM'}.
          </p>
        </div>

        {/* Clean Adherence Gauge */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#D6E6F2] shadow-sm">
          <div className="text-3xl font-black text-[#1A2F4C]">{adherencePct}%</div>
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase text-[#4A6B8F] tracking-wider">Today's Ingestion</div>
            <div className="text-xs font-semibold text-[#1A2F4C]">{taken} of {total} Doses Verified</div>
          </div>
        </div>
      </div>

      {/* ── 4 CLEAN 3D METRIC TILES ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Cognition */}
        <div className="card card-hover p-4 border-[#D6E6F2] flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D6E6F2] text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            🧠
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider">Cognition</div>
            <div className="text-xl font-black text-[#1A2F4C] mt-0.5">96%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Optimal Baseline</div>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="card card-hover p-4 border-[#D6E6F2] flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            🫀
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider">Heart Rate</div>
            <div className="text-xl font-black text-[#1A2F4C] mt-0.5">72 <span className="text-xs font-normal text-[#4A6B8F]">BPM</span></div>
            <div className="text-[10px] text-emerald-600 font-semibold">Normal Sinus</div>
          </div>
        </div>

        {/* Respiration */}
        <div className="card card-hover p-4 border-[#D6E6F2] flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            🫁
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider">Oxygen SpO2</div>
            <div className="text-xl font-black text-[#1A2F4C] mt-0.5">98%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Steady Breathing</div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="card card-hover p-4 border-[#D6E6F2] flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            🩺
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider">Active Meds</div>
            <div className="text-xl font-black text-[#1A2F4C] mt-0.5">5 <span className="text-xs font-normal text-[#4A6B8F]">Daily</span></div>
            <div className="text-[10px] text-emerald-600 font-semibold">0 Interactions</div>
          </div>
        </div>
      </div>

      {/* Drug Conflict Alert Banner (only if exists) */}
      {conflicts.length > 0 && (
        <div className="card p-3.5 bg-amber-50 border-amber-200 text-xs text-amber-900 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <div>
            <strong>Interaction Advisory:</strong> {conflicts[0].warning}
          </div>
        </div>
      )}

      {/* ── 2-COLUMN SIMPLIFIED LAYOUT ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Today's Schedule */}
        <div className="lg:col-span-7 space-y-4">
          <TodayDoses onRefresh={() => setRefresh(r => r + 1)} />
        </div>

        {/* Right Column (5 cols): Telemetry Previews & Appointments */}
        <div className="lg:col-span-5 space-y-4">
          {/* Spatial Location & CCTV Previews */}
          <div className="card p-4 space-y-2.5">
            <div className="text-[11px] font-bold uppercase text-[#4A6B8F] tracking-wider">
              Real-Time Location & Vision
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <Link 
                to="/location" 
                className="p-3 rounded-xl border border-[#D6E6F2] bg-[#F2F7FB] hover:border-[#8DB4D6] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[#4A6B8F]">
                  <span className="text-[10px] uppercase font-bold">3D Floor Plan</span>
                  <Compass size={14} className="text-[#8DB4D6]" />
                </div>
                <div className="text-sm font-bold text-[#1A2F4C] mt-1">{loc?.room || 'Living Room'}</div>
                <div className="text-[10px] text-[#8DB4D6] mt-0.5 font-semibold">View 3D Plan →</div>
              </Link>

              <Link 
                to="/cctv" 
                className="p-3 rounded-xl border border-[#D6E6F2] bg-[#F2F7FB] hover:border-[#8DB4D6] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[#4A6B8F]">
                  <span className="text-[10px] uppercase font-bold">CCTV Pose</span>
                  <Video size={14} className="text-[#8DB4D6]" />
                </div>
                <div className="text-sm font-bold text-[#1A2F4C] mt-1">Sitting (94%)</div>
                <div className="text-[10px] text-[#8DB4D6] mt-0.5 font-semibold">View Feed →</div>
              </Link>
            </div>
          </div>

          {/* Upcoming Appointment */}
          {nextAppt && (
            <div className="card p-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#4A6B8F] uppercase tracking-wider mb-2">
                <span>Next Doctor Visit</span>
                <Link to="/appointments" className="text-[#8DB4D6] hover:text-[#1A2F4C]">all →</Link>
              </div>
              <div className="text-sm font-bold text-[#1A2F4C]">Dr. {nextAppt.doctor_name} ({nextAppt.specialty})</div>
              <div className="text-xs text-[#4A6B8F] mt-0.5">{nextAppt.clinic}</div>
              <div className="mt-2 text-xs font-semibold text-[#1A2F4C] flex items-center gap-1.5 bg-[#F2F7FB] p-2 rounded-lg border border-[#D6E6F2]">
                <Calendar size={13} className="text-[#8DB4D6]" />
                <span>{nextAppt.appt_date} at {nextAppt.appt_time}</span>
              </div>
            </div>
          )}

          {/* Clean Quick Shortcuts */}
          <div className="card p-3.5 flex gap-2">
            <Link 
              to="/medications" 
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1A2F4C] bg-[#F2F7FB] hover:bg-[#D6E6F2] rounded-xl border border-[#D6E6F2] transition-colors"
            >
              Medications
            </Link>
            <Link 
              to="/doctor-prep" 
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1A2F4C] bg-[#F2F7FB] hover:bg-[#D6E6F2] rounded-xl border border-[#D6E6F2] transition-colors"
            >
              Doctor Report
            </Link>
            <Link 
              to="/care-circle" 
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1A2F4C] bg-[#F2F7FB] hover:bg-[#D6E6F2] rounded-xl border border-[#D6E6F2] transition-colors"
            >
              Care Circle
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
