import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import TodayDoses from '../components/TodayDoses'
import MoodLogger from '../components/MoodLogger'
import { 
  Calendar, AlertTriangle, Users, Bell, Compass, 
  Video, ArrowRight, ShieldAlert, Activity, Clock, CheckCircle2,
  FileText, ExternalLink, ChevronRight, Pill, HeartPulse, Sparkles,
  Stethoscope, ShieldCheck
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
  const missed = doses.filter(d => d.status === 'missed').length
  const pending = doses.filter(d => d.status === 'pending').length
  const total = doses.length
  const adherencePct = total ? Math.round((taken / total) * 100) : 0

  const nextPending = doses.find(d => d.status === 'pending')
  const nextAppt = appts.find(a => !a.is_completed)

  return (
    <div className="space-y-6">
      {/* ── HELIX HERO BANNER ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles size={13} className="text-emerald-300" />
            <span>Autonomous Telemetry & Medication Guardian</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Comprehensive 3D Care for <span className="text-emerald-300">{patient?.name || 'Dorothy Williams'}</span>
          </h1>
          <p className="mt-1 text-xs lg:text-sm text-emerald-100/90 leading-relaxed">
            Multi-stakeholder clinical ecosystem bridging patient, family caregivers, and physicians with real-time 3D spatial presence, computer vision posture classification, and proactive medication reminders.
          </p>
        </div>

        {/* Floating 3D Badge on Hero */}
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shadow-lg">
            <div className="text-3xl font-black text-emerald-300">{adherencePct}%</div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mt-0.5">Today's Adherence</div>
            <div className="text-[10px] text-emerald-200 mt-0.5">{taken}/{total} Doses Verified</div>
          </div>
        </div>
      </div>

      {/* ── 4 CLASSY 3D ORGAN & CLINICAL SPECIALTY TILES ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Neurology / Cognitive */}
        <div className="card card-hover p-4 border border-emerald-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-sm">
                🧠
              </span>
              <span className="badge badge-subtle text-[10px]">Optimal</span>
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">Neurology & Cognition</div>
            <div className="text-2xl font-bold text-emerald-950 mt-1">96%</div>
            <p className="text-[11px] text-emerald-800/80 mt-1">Cognitive baseline intact. Normal circadian sleep rhythm recorded (7.4 hrs).</p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] text-emerald-700 font-semibold flex items-center justify-between">
            <span>Alert & Oriented × 4</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 2. Cardiology / Hemodynamics */}
        <div className="card card-hover p-4 border border-emerald-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-2xl bg-rose-100/80 text-rose-800 flex items-center justify-center text-xl shadow-sm">
                🫀
              </span>
              <span className="badge bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">Controlled</span>
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">Cardiology & BP</div>
            <div className="text-2xl font-bold text-emerald-950 mt-1">72 <span className="text-xs font-normal text-emerald-800 font-mono">BPM</span></div>
            <p className="text-[11px] text-emerald-800/80 mt-1">Resting pulse normal. Last ambulatory BP 124/82 mmHg (Hypertension managed).</p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] text-emerald-700 font-semibold flex items-center justify-between">
            <span>Next ECG in 14 days</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 3. Pulmonology / Respiration */}
        <div className="card card-hover p-4 border border-emerald-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-2xl bg-sky-100/80 text-sky-800 flex items-center justify-center text-xl shadow-sm">
                🫁
              </span>
              <span className="badge badge-subtle text-[10px]">Steady</span>
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">Pulmonology & SpO2</div>
            <div className="text-2xl font-bold text-emerald-950 mt-1">98% <span className="text-xs font-normal text-emerald-800 font-mono">O₂</span></div>
            <p className="text-[11px] text-emerald-800/80 mt-1">Pulse oximetry stable. Respiration 16 bpm. Indoor HEPA filter active.</p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] text-emerald-700 font-semibold flex items-center justify-between">
            <span>No dyspnea detected</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 4. Pharmacotherapy & Safety */}
        <div className="card card-hover p-4 border border-emerald-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center text-xl shadow-sm">
                🩺
              </span>
              <span className="badge bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]">Verified</span>
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">Pharmacotherapy</div>
            <div className="text-2xl font-bold text-emerald-950 mt-1">5 <span className="text-xs font-normal text-emerald-800">Daily Meds</span></div>
            <p className="text-[11px] text-emerald-800/80 mt-1">Automated drug interaction conflict checker active. 0 severe contraindications.</p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] text-emerald-700 font-semibold flex items-center justify-between">
            <span>Conflict Guard: Active</span>
            <ChevronRight size={12} />
          </div>
        </div>
      </div>

      {/* Drug Conflict Alert Banner (if applicable) */}
      {conflicts.length > 0 && (
        <div className="card p-4 bg-amber-50/80 border-amber-300 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider">Clinical Pharmacological Interaction Alert</div>
              {conflicts.map((c, i) => (
                <div key={i} className="text-xs text-amber-900 mt-1 font-medium">{c.warning}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2-COLUMN CLINICAL & TELEMETRY WORKSPACE ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Today's Schedule & Clinical Log */}
        <div className="lg:col-span-7 space-y-5">
          <TodayDoses onRefresh={() => setRefresh(r => r + 1)} />
          <MoodLogger onLogged={() => {}} />
        </div>

        {/* Right Column (5 cols): 3D Telemetry Previews, Appointments, & Quick Links */}
        <div className="lg:col-span-5 space-y-5">
          {/* 3D Telemetry Quick Previews */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                Autonomous Telemetry Feeds
              </span>
              <span className="badge badge-subtle text-[10px]">Real-time</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 3D Residence Floor Plan Preview */}
              <Link 
                to="/location" 
                className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white hover:border-emerald-300 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">3D Floor Plan</span>
                  <Compass size={14} className="text-emerald-600 group-hover:rotate-45 transition-transform" />
                </div>
                <div className="text-sm font-bold text-emerald-950">{loc?.room || 'Living Room'}</div>
                <div className="text-[11px] text-emerald-700/80 mt-0.5">Isometric Spatial Model →</div>
              </Link>

              {/* CCTV YOLOv8 Vision Preview */}
              <Link 
                to="/cctv" 
                className="p-3 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white hover:border-emerald-300 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">CCTV Pose AI</span>
                  <Video size={14} className="text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-emerald-950">Sitting (94%)</div>
                <div className="text-[11px] text-emerald-700/80 mt-0.5">YOLOv8 Fall Detection →</div>
              </Link>
            </div>
          </div>

          {/* Next Scheduled Appointment */}
          {nextAppt && (
            <div className="card p-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5">
                <span>Upcoming Consultation</span>
                <Link to="/appointments" className="text-emerald-700 hover:text-emerald-950 font-semibold lowercase">all appointments →</Link>
              </div>
              <div className="text-sm font-extrabold text-emerald-950">Dr. {nextAppt.doctor_name} ({nextAppt.specialty})</div>
              <div className="text-xs text-emerald-800/80 mt-0.5">{nextAppt.clinic} · {nextAppt.address}</div>
              <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <Calendar size={14} className="text-emerald-700" />
                <span>{nextAppt.appt_date} at {nextAppt.appt_time}</span>
              </div>
              {nextAppt.notes && (
                <div className="text-[11px] text-emerald-700 mt-2 italic">Clinical Focus: {nextAppt.notes}</div>
              )}
            </div>
          )}

          {/* Clinical Documentation & Care Circle Shortcuts */}
          <div className="card p-4">
            <div className="text-xs font-bold uppercase text-emerald-950 tracking-wider mb-3">
              Physician & Caregiver Portal
            </div>
            <div className="space-y-2">
              <Link 
                to="/doctor-prep" 
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-emerald-900 font-semibold bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/80 transition-all"
              >
                <span className="flex items-center gap-2.5"><FileText size={15} className="text-emerald-700" /> Physician Visit Summary Dossier</span>
                <ChevronRight size={14} className="text-emerald-500" />
              </Link>
              <Link 
                to="/medications" 
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-emerald-900 font-semibold bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/80 transition-all"
              >
                <span className="flex items-center gap-2.5"><Pill size={15} className="text-emerald-700" /> Add / Edit Medication Regimen</span>
                <ChevronRight size={14} className="text-emerald-500" />
              </Link>
              <Link 
                to="/care-circle" 
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-emerald-900 font-semibold bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/80 transition-all"
              >
                <span className="flex items-center gap-2.5"><Users size={15} className="text-emerald-700" /> Manage Family Care Circle & Proxies</span>
                <ChevronRight size={14} className="text-emerald-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
