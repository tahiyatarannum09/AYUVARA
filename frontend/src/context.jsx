import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [patientId, setPatientId] = useState(() => {
    const s = sessionStorage.getItem('ec_pid')
    return s ? parseInt(s) : null
  })
  const [patient, setPatient] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (patientId) {
      sessionStorage.setItem('ec_pid', patientId)
      api.getPatient(patientId)
        .then(p => {
          setPatient(p)
          setAuthLoading(false)
        })
        .catch(() => {
          // If patient fetch fails, reset session
          sessionStorage.removeItem('ec_pid')
          setPatientId(null)
          setPatient(null)
          setAuthLoading(false)
        })
    } else {
      sessionStorage.removeItem('ec_pid')
      setPatient(null)
      setAuthLoading(false)
    }
  }, [patientId])

  const logout = () => { 
    sessionStorage.removeItem('ec_pid')
    setPatientId(null)
    setPatient(null) 
  }

  return (
    <AppCtx.Provider value={{ patientId, setPatientId, patient, setPatient, logout, authLoading }}>
      {children}
    </AppCtx.Provider>
  )
}

export const useApp = () => useContext(AppCtx)
