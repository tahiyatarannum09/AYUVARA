import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context'
import Layout from './components/Layout'
import PasscodeLogin from './components/PasscodeLogin'
import Home from './pages/Home'
import Medications from './pages/Medications'
import Appointments from './pages/Appointments'
import Adherence from './pages/Adherence'
import CareCirclePage from './pages/CareCircle'
import NotificationsPage from './pages/Notifications'
import DoctorPrepPage from './pages/DoctorPrep'
import LocationTracker from './pages/LocationTracker'
import CctvAnalysis from './pages/CctvAnalysis'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portal Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-800">
          <div className="card max-w-md w-full bg-white p-6 border-slate-300 shadow">
            <h2 className="text-base font-bold text-slate-900 mb-2">Portal Interface Notice</h2>
            <p className="text-xs text-slate-600 mb-4">
              An interface error occurred while rendering the current module.
            </p>
            <pre className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-700 overflow-x-auto mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                sessionStorage.clear()
                window.location.href = '/'
              }}
              className="btn-primary w-full py-2 text-xs"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoutes() {
  const { patientId, authLoading } = useApp()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-mono text-xs text-slate-500">
        Loading patient profile...
      </div>
    )
  }

  if (!patientId) {
    return <PasscodeLogin />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/adherence" element={<Adherence />} />
        <Route path="/care-circle" element={<CareCirclePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/doctor-prep" element={<DoctorPrepPage />} />
        <Route path="/location" element={<LocationTracker />} />
        <Route path="/cctv" element={<CctvAnalysis />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
