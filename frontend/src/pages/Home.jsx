import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Link } from 'react-router-dom'
import {
  Calendar, Video, Compass,
  Pill, Users, FileText
} from 'lucide-react'

function formatTime12(t) {
  if (!t) return ''
  try {
    const [h, m] = t.split(':').map(Number)
    const ap = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${m < 10 ? '0' + m : m} ${ap}`
  } catch { return t }
}

const FEATURE_CARDS = [
  {
    to: '/medications',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    label: 'Medications',
    sub: 'Daily Prescriptions',
    icon: Pill,
  },
  {
    to: '/cctv',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    label: 'CCTV & Posture',
    sub: 'AI Vision Shield',
    icon: Video,
  },
  {
    to: '/location',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    label: 'Floor Plan',
    sub: '3D Residence Map',
    icon: Compass,
  },
  {
    to: '/appointments',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    label: 'Appointments',
    sub: 'Physician Visits',
    icon: Calendar,
  },
]

const QUICK_ACTIONS = [
  { to: '/medications', icon: Pill,     label: 'Medications', color: 'bg-white text-[#1A2F4C] border border-[#D6E6F2]' },
  { to: '/cctv',        icon: Video,    label: 'CCTV Feed',   color: 'bg-white text-[#1A2F4C] border border-[#D6E6F2]' },
  { to: '/care-circle', icon: Users,    label: 'Care Circle', color: 'bg-white text-[#1A2F4C] border border-[#D6E6F2]' },
  { to: '/doctor-prep', icon: FileText, label: 'Dr. Report',  color: 'bg-white text-[#1A2F4C] border border-[#D6E6F2]' },
]

export default function Home() {
  const { patientId, patient } = useApp()
  const [appts, setAppts]       = useState([])
  const [doses, setDoses]       = useState([])
  const [loc, setLoc]           = useState(null)

  useEffect(() => {
    if (!patientId) return
    api.getAppointments(patientId).then(setAppts).catch(() => {})
    api.getTodayAdherence(patientId).then(setDoses).catch(() => {})
    fetch(`/api/location/${patientId}/current`).then(r => r.json()).then(setLoc).catch(() => {})
  }, [patientId])

  const taken       = doses.filter(d => d.status === 'taken').length
  const total       = doses.length
  const pct         = total ? Math.round((taken / total) * 100) : 0
  const nextPending = doses.find(d => d.status === 'pending')
  const nextAppt    = appts.find(a => !a.is_completed)

  return (
    <div className="space-y-6 pb-8">

      {/* ── CLASSY LIGHT AIRY 3D HERO BANNER ───────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 border border-[#8DB4D6]/35"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F2F7FB 40%, #E6F1F9 75%, #D6E6F2 100%)',
          boxShadow: '0 18px 45px -12px rgba(141, 180, 214, 0.35)'
        }}
      >
        {/* Decorative soft geometric grid & ambient pastel glows */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #8DB4D6 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} 
        />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#8DB4D6]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-48 w-60 h-60 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Greeting & Status */}
          <div className="lg:col-span-5 space-y-3.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#8DB4D6]/40 text-[#1A2F4C] text-[11px] font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              Autonomous Health Guardian Active
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-[#1A2F4C] tracking-tight leading-tight">
              Hello, {patient?.name?.split(' ')[0] || 'Dorothy'} 👋
            </h1>

            <p className="text-[#4A6B8F] text-xs sm:text-sm font-medium leading-relaxed">
              {nextPending
                ? `Next dose: ${nextPending.medication_name} (${nextPending.dosage}) scheduled at ${formatTime12(nextPending.scheduled_time)}.`
                : 'All scheduled daily medications are complete for today.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/medications"
                className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                View Schedule →
              </Link>
              <Link
                to="/cctv"
                className="btn-soft px-5 py-2.5 rounded-full text-xs font-bold transition-all"
              >
                CCTV Shield
              </Link>
            </div>
          </div>

          {/* Center Column: 3D Isometric Care Composition */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <svg 
              width="280" 
              height="200" 
              viewBox="0 0 280 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md select-none"
            >
              <defs>
                <filter id="softCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#8DB4D6" floodOpacity="0.4" />
                </filter>
                <linearGradient id="softCardBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F2F7FB" />
                </linearGradient>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8DB4D6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>

              {/* Central 3D Guardian Emblem */}
              <ellipse cx="140" cy="180" rx="55" ry="10" fill="#8DB4D6" opacity="0.3" />
              <circle cx="140" cy="100" r="38" fill="url(#shieldGrad)" filter="url(#softCardShadow)" />
              <circle cx="140" cy="100" r="32" fill="#FFFFFF" opacity="0.9" />
              {/* 3D Heart in center */}
              <text x="140" y="108" textAnchor="middle" fontSize="24">🫀</text>

              {/* Floating 3D Card: Heart Rate */}
              <g filter="url(#softCardShadow)">
                <rect x="10" y="20" width="105" height="48" rx="14" fill="url(#softCardBg)" stroke="#D6E6F2" strokeWidth="1" />
                <circle cx="30" cy="44" r="12" fill="#fee2e2" />
                <text x="30" y="48" textAnchor="middle" fontSize="11">💓</text>
                <text x="50" y="38" fill="#4A6B8F" fontSize="8" fontWeight="700">HEART RATE</text>
                <text x="50" y="52" fill="#1A2F4C" fontSize="13" fontWeight="900">72 BPM</text>
              </g>

              {/* Floating 3D Card: Oxygen SpO2 */}
              <g filter="url(#softCardShadow)">
                <rect x="165" y="14" width="105" height="48" rx="14" fill="url(#softCardBg)" stroke="#D6E6F2" strokeWidth="1" />
                <circle cx="185" cy="38" r="12" fill="#e0f2fe" />
                <text x="185" y="42" textAnchor="middle" fontSize="11">🫁</text>
                <text x="205" y="32" fill="#4A6B8F" fontSize="8" fontWeight="700">OXYGEN SpO₂</text>
                <text x="205" y="47" fill="#1A2F4C" fontSize="13" fontWeight="900">98%</text>
              </g>

              {/* Floating 3D Card: Ayuvara 3D Capsule */}
              <g filter="url(#softCardShadow)">
                <rect x="160" y="135" width="110" height="50" rx="14" fill="url(#softCardBg)" stroke="#D6E6F2" strokeWidth="1" />
                {/* 3D Bi-color pill */}
                <rect x="175" y="152" width="34" height="16" rx="8" fill="url(#pillGrad)" />
                <line x1="192" y1="152" x2="192" y2="168" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                <text x="216" y="160" fill="#1A2F4C" fontSize="10" fontWeight="800">5 Meds</text>
                <text x="216" y="172" fill="#4A6B8F" fontSize="7" fontWeight="600">Daily Safe</text>
              </g>

              {/* Floating 3D Card: Living Room Location */}
              <g filter="url(#softCardShadow)">
                <rect x="10" y="135" width="105" height="50" rx="14" fill="url(#softCardBg)" stroke="#D6E6F2" strokeWidth="1" />
                <circle cx="30" cy="160" r="12" fill="#dbeafe" />
                <text x="30" y="164" textAnchor="middle" fontSize="11">🏠</text>
                <text x="48" y="155" fill="#4A6B8F" fontSize="7" fontWeight="700">LOCATION</text>
                <text x="48" y="168" fill="#1A2F4C" fontSize="10" fontWeight="800">Living Room</text>
              </g>

              {/* Subtle connection arcs */}
              <path d="M100 44 Q 130 65 140 75" stroke="#8DB4D6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <path d="M180 44 Q 150 65 140 75" stroke="#8DB4D6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>

          {/* Right Column: Progress Card */}
          <div className="lg:col-span-3 flex justify-end">
            <div 
              className="w-full bg-white/95 rounded-2xl p-5 border border-[#8DB4D6]/35 text-center flex flex-col justify-between"
              style={{ boxShadow: '0 12px 28px -6px rgba(141, 180, 214, 0.3)' }}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#4A6B8F]">Today's Progress</div>
                <div className="text-4xl font-black text-[#1A2F4C] mt-1 tracking-tight">{pct}%</div>
                <div className="text-xs text-[#4A6B8F] font-semibold mt-0.5">{taken} of {total} Doses Verified</div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="w-full h-2 bg-[#D6E6F2] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #38bdf8 0%, #8DB4D6 100%)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#4A6B8F]">
                  <span>Adherence</span>
                  <span className="text-[#1A2F4C]">{pct}% Target</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4 CLEAN VITALS METRIC CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { emoji: '🧠', label: 'Cognition',   val: '96%',    sub: 'Optimal' },
          { emoji: '🫀', label: 'Heart Rate',  val: '72 BPM', sub: 'Normal' },
          { emoji: '🫁', label: 'SpO₂ Oxygen', val: '98%',    sub: 'Steady' },
          { emoji: '🩺', label: 'Active Meds', val: '5 Daily', sub: 'Verified' },
        ].map(v => (
          <div key={v.label} className="card card-hover p-4 flex items-center gap-3.5 border-[#D6E6F2]">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F7FB] border border-[#D6E6F2] text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {v.emoji}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-[#4A6B8F] tracking-wide">{v.label}</div>
              <div className="text-lg font-black text-[#1A2F4C] leading-tight mt-0.5">{v.val}</div>
              <div className="text-[10px] text-blue-600 font-semibold">{v.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── LIVE CCTV VISION SPOTLIGHT CARD ──────────────────────────────── */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border border-[#8DB4D6]/40 flex flex-wrap items-center justify-between gap-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F2F7FB 50%, #E3EFF8 100%)',
          boxShadow: '0 12px 32px -8px rgba(141, 180, 214, 0.3)'
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white relative flex-shrink-0 shadow-md">
            <Video size={24} className="text-[#38bdf8]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D6E6F2] text-[#1A2F4C]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Camera · Living Room
              </span>
              <span className="text-xs font-mono text-[#4A6B8F]">24 FPS</span>
            </div>
            <h3 className="text-base font-extrabold text-[#1A2F4C] mt-1">
              AI Vision &amp; Kinematic Posture: <span className="text-emerald-700">Sitting (96% Confidence)</span>
            </h3>
            <p className="text-xs text-[#4A6B8F] mt-0.5">
              Continuous fall risk monitor active · 0 alerts logged today · Symmetrical gait detected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/cctv"
            className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all"
          >
            <span>Open CCTV Station</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* ── CARE FEATURES PHOTO CARDS (PINTEREST STYLE) ───────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-extrabold text-[#1A2F4C]">Care Features</h2>
            <p className="text-xs text-[#4A6B8F]">Intelligent monitoring &amp; clinical companion</p>
          </div>
          <Link to="/medications" className="text-xs text-[#38bdf8] font-bold hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURE_CARDS.map(fc => (
            <Link
              key={fc.to}
              to={fc.to}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#D6E6F2] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-32 w-full overflow-hidden bg-[#F2F7FB]">
                <img
                  src={fc.img}
                  alt={fc.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#1A2F4C] shadow-sm">
                  <fc.icon size={13} />
                </div>
              </div>
              <div className="p-3 bg-white">
                <div className="font-bold text-[#1A2F4C] text-xs">{fc.label}</div>
                <div className="text-[#4A6B8F] text-[10px] mt-0.5">{fc.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROW: INSPIRATION, QUICK ACCESS & UPCOMING APPOINTMENT ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Philosophy Card (Soft airy pastel tone) */}
        <div 
          className="lg:col-span-5 rounded-2xl p-6 border border-[#8DB4D6]/30 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F2F7FB 60%, #E3EFF8 100%)',
            boxShadow: '0 8px 24px rgba(141, 180, 214, 0.18)'
          }}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8DB4D6]">Care Philosophy</div>
            <blockquote className="text-lg font-black text-[#1A2F4C] leading-snug mt-2">
              “Health is not just the absence of disease — it is the presence of continuous care.”
            </blockquote>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs text-[#4A6B8F] font-semibold border-t border-[#D6E6F2]">
            <span>AYUVARA Senior Suite</span>
            <span className="text-[#38bdf8]">v2.4 Active</span>
          </div>
        </div>

        {/* Quick Access Tiles */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10px] font-bold uppercase text-[#4A6B8F] tracking-wider mb-2">Quick Access</div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(qa => (
              <Link
                key={qa.to}
                to={qa.to}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${qa.color}`}
              >
                <qa.icon size={18} className="text-[#8DB4D6]" />
                <span className="text-[10px] font-bold text-center leading-tight">{qa.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="lg:col-span-4 space-y-3">
          {nextAppt ? (
            <div className="card p-4 border-[#D6E6F2] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-[#4A6B8F] tracking-wider">Next Doctor Visit</span>
                <Link to="/appointments" className="text-[10px] text-[#38bdf8] font-bold hover:underline">All →</Link>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-[#D6E6F2] flex items-center justify-center text-xl flex-shrink-0">
                  🩺
                </div>
                <div>
                  <div className="font-bold text-[#1A2F4C] text-xs sm:text-sm">{nextAppt.doctor_name || 'Dr. Priya Sharma'}</div>
                  <div className="text-[11px] text-[#4A6B8F]">{nextAppt.specialty || 'Endocrinology'}</div>
                  <div className="text-[11px] text-[#38bdf8] font-semibold mt-0.5 flex items-center gap-1">
                    <Calendar size={11} />
                    {nextAppt.datetime
                      ? new Date(nextAppt.datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : 'Scheduled'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-4 border-[#D6E6F2] rounded-2xl shadow-sm text-center text-xs text-[#4A6B8F]">
              No upcoming appointments scheduled
            </div>
          )}

          {/* Location link pill */}
          <Link 
            to="/location" 
            className="card p-3 border-[#D6E6F2] rounded-2xl shadow-sm flex items-center justify-between hover:border-[#8DB4D6] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F2F7FB] border border-[#D6E6F2] flex items-center justify-center text-sm">
                🏠
              </div>
              <div>
                <div className="text-[9px] text-[#4A6B8F] font-bold uppercase">Current Room</div>
                <div className="font-bold text-[#1A2F4C] text-xs">{loc?.room || 'Living Room'}</div>
              </div>
            </div>
            <span className="text-[10px] text-[#38bdf8] font-bold">3D Map →</span>
          </Link>
        </div>

      </div>

    </div>
  )
}
