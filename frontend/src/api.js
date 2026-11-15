const BASE = '/api'

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Auth
  verifyPasscode: (patient_id, passcode) =>
    req('POST', '/auth/verify-passcode', { patient_id, passcode }),

  // Patients
  listPatients: () => req('GET', '/patients/'),
  getPatient: (id) => req('GET', `/patients/${id}`),
  createPatient: (data) => req('POST', '/patients/', data),
  updatePatient: (id, data) => req('PUT', `/patients/${id}`, data),

  // Mood
  logMood: (data) => req('POST', '/patients/mood', data),
  getMoodLogs: (pid) => req('GET', `/patients/${pid}/mood`),

  // Medications
  getMedications: (pid) => req('GET', `/medications/${pid}`),
  addMedication: (data) => req('POST', '/medications/', data),
  updateMedication: (id, data) => req('PUT', `/medications/${id}`, data),
  deleteMedication: (id) => req('DELETE', `/medications/${id}`),
  getConflicts: (pid) => req('GET', `/medications/${pid}/conflicts`),
  getTodayAdherence: (pid) => req('GET', `/medications/${pid}/adherence/today`),
  markDose: (log_id, status) => req('POST', '/medications/adherence/mark', { log_id, status }),
  getHeatmap: (pid) => req('GET', `/medications/${pid}/adherence/heatmap`),

  // Appointments
  getAppointments: (pid) => req('GET', `/appointments/${pid}`),
  addAppointment: (data) => req('POST', '/appointments/', data),
  updateAppointment: (id, data) => req('PUT', `/appointments/${id}`, data),
  deleteAppointment: (id) => req('DELETE', `/appointments/${id}`),

  // Care Circle
  getCareCircle: (pid) => req('GET', `/care-circle/${pid}`),
  addMember: (data) => req('POST', '/care-circle/', data),
  removeMember: (id) => req('DELETE', `/care-circle/${id}`),

  // Notifications
  getNotifications: (pid) => req('GET', `/notifications/${pid}`),

  // Doctor Prep
  getDoctorPrep: (pid) => req('GET', `/doctor-prep/${pid}`),
}

