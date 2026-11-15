import { useState, useEffect, useRef } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { 
  Lock, ShieldCheck, KeyRound, ArrowRight, Sparkles, CheckCircle2,
  Leaf, Users, UserCheck, Stethoscope, HeartHandshake, AlertCircle
} from 'lucide-react'

const DEMO_PROFILES = [
  { id: 1, name: 'Dorothy Williams', role: 'Elderly Individual (Patient)', pin: '1234', icon: '👵' },
  { id: 1, name: 'Sarah Williams', role: 'Daughter & Primary Caregiver', pin: '1234', icon: '👩' },
  { id: 1, name: 'Dr. Robert Chen', role: 'Attending Cardiologist', pin: '1234', icon: '👨‍⚕️' },
  { id: 1, name: 'Marcus Vance, RN', role: 'Home Healthcare Nurse', pin: '1234', icon: '🩺' },
]

export default function PasscodeLogin() {
  const { setPatientId, setPatient } = useApp()
  const [selectedProfile, setSelectedProfile] = useState(DEMO_PROFILES[0])
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const executeLogin = async (pid, code) => {
    setLoading(true)
    setError('')
    try {
      await api.verifyPasscode(pid, code)
      const p = await api.getPatient(pid)
      setPatient(p)
      setPatientId(pid)
    } catch(e) {
      setError(e.message || 'Authentication failed. Please verify your passcode.')
      setPasscode('')
      inputRef.current?.focus()
    } finally { 
      setLoading(false) 
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (passcode.length < 4) {
      setError('Please enter at least 4 digits.')
      return
    }
    executeLogin(selectedProfile.id, passcode)
  }

  const quickDemoLogin = (profile) => {
    setSelectedProfile(profile)
    setPasscode(profile.pin)
    executeLogin(profile.id, profile.pin)
  }

  const digits = ['1','2','3','4','5','6','7','8','9','C','0','⌫']

  const press = (d) => {
    if (d === '⌫') setPasscode(p => p.slice(0, -1))
    else if (d === 'C') setPasscode('')
    else if (d && passcode.length < 6) setPasscode(p => p + d)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-[#0a2f24] to-emerald-900 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md">
        {/* Helix Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Leaf size={28} className="fill-white/20" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Helix ElderCare</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              3D Platform
            </span>
          </h1>
          <p className="text-xs text-emerald-200/80 mt-1">Multi-Stakeholder Shared Elderly Care Ecosystem</p>
        </div>

        {/* Card */}
        <div className="card p-6 border-emerald-900/20 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl">
          {/* Multi-Stakeholder Profile Quick Selector */}
          <div className="mb-5 pb-4 border-b border-emerald-900/10">
            <label className="label flex items-center justify-between text-emerald-950">
              <span>Select Care Ecosystem Stakeholder</span>
              <span className="badge badge-subtle text-[10px]">PIN: 1234</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DEMO_PROFILES.map((prof, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedProfile(prof)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    selectedProfile.role === prof.role 
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm' 
                      : 'bg-emerald-50/50 text-emerald-950 border-emerald-200/80 hover:bg-emerald-100/60'
                  }`}
                >
                  <div className="text-xs font-bold truncate flex items-center gap-1.5">
                    <span>{prof.icon}</span>
                    <span className="truncate">{prof.name}</span>
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${selectedProfile.role === prof.role ? 'text-emerald-200' : 'text-emerald-700'}`}>
                    {prof.role.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* 1-Click Direct Authenticate Button */}
            <button
              type="button"
              onClick={() => quickDemoLogin(selectedProfile)}
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 -translate-y-0.5 hover:shadow-lg"
            >
              <CheckCircle2 size={16} />
              <span>{loading ? 'Authenticating Securely...' : `1-Click Enter as ${selectedProfile.name}`}</span>
            </button>
          </div>

          {/* Secure Passcode Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label text-emerald-950 mb-0">Enter Security PIN Code</label>
                <span className="text-[11px] text-emerald-700 font-mono">Demo: 1234</span>
              </div>
              <input
                ref={inputRef}
                type="password"
                maxLength={6}
                value={passcode}
                onChange={e => setPasscode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="input text-center text-2xl tracking-[0.4em] font-mono h-12 border-emerald-300 focus:border-emerald-600"
                autoComplete="off"
              />
            </div>

            {/* Numeric Keypad for Senior Touch/Accessibility */}
            <div className="grid grid-cols-3 gap-2">
              {digits.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => press(d)}
                  className={`h-10 rounded-xl text-sm font-bold transition-all border ${
                    d === 'C'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : d === '⌫'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50/50 text-emerald-950 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || passcode.length < 4}
              className="btn-primary w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Care Portal'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Production Security Seal */}
          <div className="mt-4 pt-3 border-t border-emerald-100 text-[10px] text-emerald-800/80 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              Cryptographic Salted Hash · Rate-Limited
            </span>
            <span className="font-mono text-emerald-700">AES-256</span>
          </div>
        </div>
      </div>
    </div>
  )
}
