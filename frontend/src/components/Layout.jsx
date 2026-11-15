import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context'
import AyuvaraLogo from './AyuvaraLogo'
import { 
  LayoutDashboard, Pill, Calendar, BarChart2, Users, Bell, 
  FileText, LogOut, Compass, Video, ZoomIn, Menu, X, Sparkles, CheckCircle2
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/location', icon: Compass, label: '3D Residence Map' },
  { to: '/cctv', icon: Video, label: 'CCTV Vision & Posture' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/adherence', icon: BarChart2, label: 'Adherence & 3D Voxel' },
  { to: '/care-circle', icon: Users, label: 'Care Circle' },
  { to: '/doctor-prep', icon: FileText, label: 'Physician Report' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
]

export default function Layout({ children }) {
  const { patient, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [seniorFontSize, setSeniorFontSize] = useState(false)

  return (
    <div className={`flex h-screen bg-[#F2F7FB] text-[#1A2F4C] overflow-hidden font-sans ${seniorFontSize ? 'text-base' : 'text-sm'}`}>
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#D6E6F2] flex-shrink-0 z-20" style={{boxShadow:'4px 0 24px rgba(141,180,214,0.12)'}}>
        {/* Ayuvara Logo Header */}
        <div className="h-16 px-5 border-b border-[#D6E6F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AyuvaraLogo size="sm" showText={false} />
            <div>
              <div className="font-serif text-base font-black tracking-[0.22em] uppercase text-[#1A2F4C]">AYUVARA</div>
              <div className="text-[10px] text-[#4A6B8F] font-medium tracking-wide">ElderCare Companion</div>
            </div>
          </div>
        </div>

        {/* Minimal Telemetry Pill */}
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-[#F2F7FB] border border-[#D6E6F2]">
          <div className="text-[10px] uppercase font-bold text-[#4A6B8F] tracking-wider mb-1.5 flex items-center justify-between">
            <span>Live Status</span>
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4A6B8F]">HR: <strong className="text-[#1A2F4C]">72 BPM</strong></span>
            <span className="text-[#4A6B8F]">SpO2: <strong className="text-[#1A2F4C]">98%</strong></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#D6E6F2] text-[#1A2F4C] font-bold shadow-sm'
                    : 'text-[#4A6B8F] hover:text-[#1A2F4C] hover:bg-[#F2F7FB]'
                }`
              }
            >
              <Icon size={16} className="opacity-80" />
              <div className="flex items-center justify-between w-full">
                <span>{label}</span>
                {to === '/cctv' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#D6E6F2]">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A6B8F] hover:text-[#1A2F4C] hover:bg-[#D6E6F2] transition-all border border-[#D6E6F2]"
          >
            <LogOut size={13} /> Exit / Lock
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Demographics Bar */}
        <header className="bg-white border-b border-[#D6E6F2] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#F2F7FB] text-[#1A2F4C]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Clean Patient Pill */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8DB4D6] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                DW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#1A2F4C]">{patient?.name || 'Dorothy Williams'}</span>
                  <span className="badge badge-subtle text-[10px]">Age 76</span>
                </div>
                <div className="text-[11px] text-[#4A6B8F] flex items-center gap-2">
                  <span>Blood: <strong className="text-[#1A2F4C]">{patient?.blood_type || 'O+'}</strong></span>
                  <span>·</span>
                  <span>Allergies: <strong className="text-rose-600">{patient?.allergies || 'Penicillin'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeniorFontSize(!seniorFontSize)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F2F7FB] text-[#1A2F4C] border border-[#D6E6F2] hover:bg-[#D6E6F2] flex items-center gap-1"
            >
              <ZoomIn size={12} />
              <span>{seniorFontSize ? 'Standard' : 'Large Text'}</span>
            </button>

            <NavLink 
              to="/notifications" 
              className="p-2 text-[#4A6B8F] hover:text-[#1A2F4C] hover:bg-[#F2F7FB] rounded-xl relative border border-[#D6E6F2]"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </NavLink>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-white h-full p-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#D6E6F2]">
                  <AyuvaraLogo size="sm" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#1A2F4C]"><X size={18} /></button>
                </div>
                <nav className="mt-3 space-y-1">
                  {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-[#D6E6F2] text-[#1A2F4C]' : 'text-[#4A6B8F] hover:bg-[#F2F7FB]'
                        }`
                      }
                    >
                      <Icon size={15} />
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

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
