import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context'
import { 
  LayoutDashboard, Pill, Calendar, BarChart2, Users, Bell, 
  FileText, LogOut, Compass, Video, ShieldAlert, Phone, AlertCircle,
  Menu, X, CheckCircle, Clock, Sparkles, HeartPulse, Activity,
  Leaf, ZoomIn, Eye, ShieldCheck
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Clinical Dashboard' },
  { to: '/location', icon: Compass, label: '3D Residence & Sensors' },
  { to: '/cctv', icon: Video, label: 'CCTV Vision & Posture AI' },
  { to: '/medications', icon: Pill, label: 'Medication Management' },
  { to: '/appointments', icon: Calendar, label: 'Doctor Appointments' },
  { to: '/adherence', icon: BarChart2, label: 'Adherence & 3D Voxel' },
  { to: '/care-circle', icon: Users, label: 'Care Circle & Family' },
  { to: '/doctor-prep', icon: FileText, label: 'Physician Visit Brief' },
  { to: '/notifications', icon: Bell, label: 'Proactive Alert Log' },
]

export default function Layout({ children }) {
  const { patient, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [seniorFontSize, setSeniorFontSize] = useState(false)

  return (
    <div className={`flex h-screen bg-[#f7faf8] text-[#0f291e] overflow-hidden font-sans ${seniorFontSize ? 'text-base' : 'text-sm'}`}>
      {/* ── HELIX CLASSY SIDEBAR ────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-emerald-900/10 flex-shrink-0 z-20 shadow-sm">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-emerald-900/10 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Leaf size={18} className="fill-white/20" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-emerald-950 flex items-center gap-1.5">
                <span>Helix</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">3D</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">Advanced ElderCare</div>
            </div>
          </div>
        </div>

        {/* 3D Biometric Quick HUD */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-md">
          <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider mb-2 flex items-center justify-between">
            <span>Patient Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <div className="text-[10px] text-emerald-200">Vitals / HR</div>
              <div className="font-bold text-sm">72 BPM</div>
            </div>
            <div className="bg-white/10 p-1.5 rounded-lg">
              <div className="text-[10px] text-emerald-200">SpO2 Steady</div>
              <div className="font-bold text-sm">98%</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-wider uppercase text-emerald-800/60">
          Clinical Navigation
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-50'
                }`
              }
            >
              <Icon size={16} className="opacity-90" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-emerald-900/10 bg-emerald-50/40">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-900 hover:bg-emerald-100/70 transition-all border border-emerald-200"
          >
            <LogOut size={13} /> Secure Lock / Switch Profile
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Demographics & Accessibility Banner */}
        <header className="bg-white border-b border-emerald-900/10 px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 text-emerald-900"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Patient Identity Tag */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                DW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-emerald-950">{patient?.name || 'Dorothy Williams'}</span>
                  <span className="text-xs text-emerald-800/70 font-mono">Age 76 (1948-03-15)</span>
                  <span className="badge badge-subtle text-[10px]">MRN: #84920</span>
                </div>
                <div className="text-xs text-emerald-800/80 flex items-center gap-3 mt-0.5">
                  <span>Blood: <strong className="text-emerald-950 font-bold">{patient?.blood_type || 'O+'}</strong></span>
                  <span>Allergies: <strong className="text-rose-700 font-bold">{patient?.allergies || 'Penicillin, Sulfa'}</strong></span>
                  <span className="hidden sm:inline">Emergency: <strong className="text-emerald-950">{patient?.emergency_contact_name || 'Sarah Williams'} ({patient?.emergency_contact_phone || '+1-555-0199'})</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Controls & Accessibility */}
          <div className="flex items-center gap-3">
            {/* Senior Accessibility Font Size Toggle */}
            <button
              onClick={() => setSeniorFontSize(!seniorFontSize)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
              title="Toggle Large Senior Text Size"
            >
              <ZoomIn size={13} />
              <span>{seniorFontSize ? 'Standard Text' : 'Large Text'}</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ecosystem Online
            </span>

            <NavLink 
              to="/notifications" 
              className="p-2 text-emerald-900 hover:bg-emerald-50 rounded-xl relative border border-emerald-200/60"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </NavLink>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-white h-full p-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <span className="font-bold text-xs uppercase text-emerald-800">Helix Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-emerald-900"><X size={18} /></button>
                </div>
                <nav className="mt-3 space-y-1">
                  {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-emerald-900 text-white' : 'text-emerald-900 hover:bg-emerald-50'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <button onClick={() => { logout(); navigate('/') }} className="btn-ghost w-full text-xs">
                Exit Session
              </button>
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
