import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Bell, Mail, CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const { patientId } = useApp()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setLoading(false)
      return
    }
    api.getNotifications(patientId)
      .then(res => setNotifs(Array.isArray(res) ? res : []))
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false))
  }, [patientId])

  const safeNotifs = Array.isArray(notifs) ? notifs : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Alerts &amp; Email Reminders</h1>
          <p className="text-xs text-[#4A6B8F]">Proactive alerts dispatched for medication schedules, adherence digests, and doctor visits</p>
        </div>
      </div>

      {loading ? (
        <div className="card animate-pulse h-40 bg-[#F2F7FB]" />
      ) : (
        <div className="space-y-3">
          {safeNotifs.map(n => (
            <div key={n.id} className="card p-4 border-[#D6E6F2] shadow-sm bg-white">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔔</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-xs text-[#1A2F4C]">
                      {n.subject || n.message || 'Medication Telemetry Notification'}
                    </div>
                    <span className="badge bg-emerald-100 text-emerald-800 text-[10px] shrink-0 flex items-center gap-1">
                      <CheckCheck size={11} /> Email Dispatched
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4A6B8F] font-mono mt-0.5">
                    To: {n.recipient_email || 'caregiver@ayuvara.care'} · {n.sent_at ? new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Delivered'}
                  </div>
                  <p className="text-xs text-[#1A2F4C] mt-2 bg-[#F2F7FB] p-2.5 rounded-xl border border-[#D6E6F2]">
                    {n.body || n.message || 'Notification details recorded in patient telemetry.'}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {safeNotifs.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-[#D6E6F2] p-8">
              <Bell size={36} className="text-[#8DB4D6] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#1A2F4C]">No alert notifications recorded yet</p>
              <p className="text-xs text-[#4A6B8F] mt-1">Automated medication and consultation reminders will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
