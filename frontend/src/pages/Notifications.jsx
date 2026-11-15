import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Bell, Mail } from 'lucide-react'

export default function NotificationsPage() {
  const { patientId } = useApp()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getNotifications(patientId).then(setNotifs).catch(() => {}).finally(() => setLoading(false))
  }, [patientId])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D6E6F2]">
        <div>
          <h1 className="text-xl font-bold text-[#1A2F4C]">Alerts & Email Reminders</h1>
          <p className="text-xs text-[#4A6B8F]">Proactive alerts dispatched for medication schedules and visits</p>
        </div>
      </div>

      {loading ? <div className="card animate-pulse h-40 bg-[#F2F7FB]" /> : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div key={n.id} className="card p-4 border-[#D6E6F2] shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔔</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-[#1A2F4C]">{n.subject}</div>
                    <span className="badge badge-subtle text-[10px]">Email Dispatched</span>
                  </div>
                  <div className="text-[11px] text-[#4A6B8F] font-mono mt-0.5">
                    To: {n.recipient_email || 'caregiver@ayuvara.health'} · {new Date(n.sent_at).toLocaleTimeString()}
                  </div>
                  <p className="text-xs text-[#1A2F4C] mt-2 bg-[#F2F7FB] p-2.5 rounded-xl border border-[#D6E6F2]">
                    {n.body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {notifs.length === 0 && (
            <div className="text-center py-10">
              <Bell size={36} className="text-[#8DB4D6] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#4A6B8F]">No alert notifications recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
