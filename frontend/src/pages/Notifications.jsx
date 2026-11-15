import { useState, useEffect } from 'react'
import { api } from '../api'
import { useApp } from '../context'
import { Bell, Mail, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react'

const TYPE_ICONS = { reminder: '💊', missed: '⚠️', appointment: '📅', digest: '☀️', conflict: '🚨' }

export default function NotificationsPage() {
  const { patientId } = useApp()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getNotifications(patientId).then(setNotifs).catch(() => {}).finally(() => setLoading(false))
  }, [patientId])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-subtle">Automated Dispatch</span>
            <span className="text-xs text-emerald-800 font-mono">{notifs.length} Broadcast Logs</span>
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mt-1">Proactive Email Notifications & Reminders</h1>
          <p className="text-xs text-emerald-800/80">Proactive background alerts dispatched for upcoming doses, missed medications, and doctor visits</p>
        </div>
      </div>

      <div className="card p-3.5 bg-emerald-50/70 border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
        <Mail size={16} className="text-emerald-700 flex-shrink-0" />
        <div>
          <strong className="text-emerald-900 font-extrabold">Autonomous Notification Engine:</strong> Reminders for doses 30 minutes in advance, missed dose escalations, and 24-hour appointment digests are logged here and transmitted to authorized Care Circle emails.
        </div>
      </div>

      {loading ? <div className="card animate-pulse h-48 bg-emerald-50/50" /> : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div key={n.id} className="card p-4 border border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
              <div className="flex items-start gap-3.5">
                <span className="text-2xl flex-shrink-0">{TYPE_ICONS[n.notif_type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-xs text-emerald-950">{n.subject}</div>
                    <span className="badge badge-subtle text-[10px]">
                      {n.status === 'mock' ? 'Simulated Email' : n.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800/70 font-mono mt-0.5">
                    To: {n.recipient_email || 'caregiver@helix.health'} · {new Date(n.sent_at).toLocaleString()}
                  </div>
                  <details className="mt-2.5">
                    <summary className="text-[11px] font-bold text-emerald-700 cursor-pointer hover:text-emerald-900">
                      View Clinical Email Body
                    </summary>
                    <pre className="text-xs text-emerald-950 mt-2 whitespace-pre-wrap font-sans bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 leading-relaxed">
                      {n.body}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          ))}

          {notifs.length === 0 && (
            <div className="text-center py-12">
              <Bell size={40} className="text-emerald-200 mx-auto mb-3" />
              <p className="text-emerald-900/60 font-semibold text-sm">No notification logs recorded yet</p>
              <p className="text-emerald-700/60 text-xs mt-1">Autonomous reminder engine generates alerts 30 minutes before doses and for missed schedules</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
