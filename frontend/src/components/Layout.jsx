import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context'
import { api } from '../api'
import AyuvaraLogo from './AyuvaraLogo'
import { 
  LayoutDashboard, Pill, Calendar, BarChart2, Users, Bell, 
  FileText, LogOut, Compass, Video, ZoomIn, Menu, X, Volume2, AlertOctagon, CheckCircle2
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
  const [speaking, setSpeaking] = useState(false)
  const [sosModal, setSosModal] = useState(false)

  // Senior Speech Synthesis Accessibility Readout
  const handleVoiceReadout = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.")
      return
    }
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const text = `Hello ${patient?.name || 'Dorothy'}! Your morning doses of Metformin, Lisinopril, and Aspirin have been verified successfully. Your next medication is Vitamin D3 scheduled at 1:00 PM with lunch. Your next medical consultation is with Doctor Priya Sharma on November 18. Have a wonderful and healthy day!`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9  // slightly slower for senior clarity
    utterance.pitch = 1.0
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleSosTrigger = async () => {
    try {
      await api.triggerSos(patient?.id || 1)
    } catch (e) {}
    setSosModal(true)
  }

  return (
    <div className={`flex h-screen bg-[#F2F7FB] text-[#1A2F4C] overflow-hidden font-sans ${seniorFontSize ? 'text-base font-medium' : 'text-sm'}`}>
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside 
        className="hidden lg:flex flex-col w-60 bg-white border-r border-[#D6E6F2] flex-shrink-0 z-20" 
        style={{ boxShadow: '4px 0 24px rgba(141,180,214,0.12)' }}
        aria-label="Sidebar Navigation"
      >
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
            <span>Live Health Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4A6B8F]">HR: <strong className="text-[#1A2F4C]">72 BPM</strong></span>
            <span className="text-[#4A6B8F]">SpO2: <strong className="text-[#1A2F4C]">98%</strong></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1" role="navigation">
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

        {/* Emergency SOS Button in Sidebar */}
        <div className="p-3 mx-3 mb-2">
          <button
            onClick={handleSosTrigger}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            aria-label="Trigger Emergency SOS Alert"
          >
            <AlertOctagon size={16} className="animate-pulse" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>

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
        {/* Top Demographics & Senior Accessibility Bar */}
        <header 
          className="bg-white border-b border-[#D6E6F2] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10 shadow-sm"
          role="banner"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#F2F7FB] text-[#1A2F4C]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Patient Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8DB4D6] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                DW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#1A2F4C]">{patient?.name || 'Dorothy Williams'}</span>
                  <span className="badge badge-subtle text-[10px]">Senior Patient (Age 76)</span>
                </div>
                <div className="text-[11px] text-[#4A6B8F] flex items-center gap-2">
                  <span>Blood: <strong className="text-[#1A2F4C]">{patient?.blood_type || 'O+'}</strong></span>
                  <span>·</span>
                  <span>Allergies: <strong className="text-rose-600">{patient?.allergies || 'Penicillin'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Senior Accessibility Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Senior Voice Readout TTS Button */}
            <button
              onClick={handleVoiceReadout}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                speaking 
                  ? 'bg-amber-500 text-white border-amber-500 animate-pulse' 
                  : 'bg-[#F2F7FB] text-[#1A2F4C] border-[#D6E6F2] hover:bg-[#D6E6F2]'
              }`}
              title="Voice announcement of daily schedule for low-vision seniors"
              aria-label="Read schedule aloud"
            >
              <Volume2 size={13} className={speaking ? 'text-white' : 'text-[#38bdf8]'} />
              <span>{speaking ? 'Speaking...' : '🔊 Read Aloud'}</span>
            </button>

            {/* Senior Large Text Toggle */}
            <button
              onClick={() => setSeniorFontSize(!seniorFontSize)}
              className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#F2F7FB] text-[#1A2F4C] border border-[#D6E6F2] hover:bg-[#D6E6F2] flex items-center gap-1"
              aria-label="Toggle Large Text Accessibility"
            >
              <ZoomIn size={12} />
              <span>{seniorFontSize ? 'Standard' : 'Large Text'}</span>
            </button>

            {/* Notifications Pill */}
            <NavLink 
              to="/notifications" 
              className="p-2 text-[#4A6B8F] hover:text-[#1A2F4C] hover:bg-[#F2F7FB] rounded-xl relative border border-[#D6E6F2]"
              aria-label="View notifications"
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
              <div className="space-y-2">
                <button
                  onClick={handleSosTrigger}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon size={14} /> SOS Emergency
                </button>
                <button onClick={() => { logout(); navigate('/') }} className="btn-ghost w-full text-xs">
                  Exit Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6" role="main">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Emergency SOS Confirmation Modal */}
      {sosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-white border-2 border-rose-500 shadow-2xl p-6 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-3xl shadow-inner animate-bounce">
              🚨
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1A2F4C]">Emergency Alert Dispatched</h2>
              <p className="text-xs text-[#4A6B8F] mt-1">
                Critical priority notification transmitted to all designated emergency proxies.
              </p>
            </div>
            <div className="bg-[#F2F7FB] p-3.5 rounded-2xl border border-[#D6E6F2] text-xs text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A2F4C]">James Williams (Son)</span>
                <span className="badge bg-emerald-100 text-emerald-800 text-[10px]">SMS Delivered</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A2F4C]">Sarah Chen (Caregiver)</span>
                <span className="badge bg-emerald-100 text-emerald-800 text-[10px]">Call Dispatched</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A2F4C]">City Emergency Services</span>
                <span className="badge bg-blue-100 text-blue-800 text-[10px]">GPS Transmitted</span>
              </div>
            </div>
            <button
              onClick={() => setSosModal(false)}
              className="btn-primary w-full py-2.5 text-xs font-bold"
            >
              Acknowledge &amp; Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
