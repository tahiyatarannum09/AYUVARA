import { useState, useEffect } from 'react'
import TodayDoses from '../components/TodayDoses'
import MoodLogger from '../components/MoodLogger'
import AyuvaraLogo from '../components/AyuvaraLogo'
import { Camera, MapPin, HeartPulse } from 'lucide-react'

export default function LaptopDashboard() {
  const [cctvLive, setCctvLive] = useState(true)
  const [roomImg, setRoomImg] = useState('/images/floorplan-placeholder.png')

  // Demo toggle for live feed
  useEffect(() => {
    const timer = setInterval(() => setCctvLive(prev => !prev), 15000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#F2F7FB] p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <AyuvaraLogo size="lg" className="h-12 w-12" />
          <h1 className="text-2xl font-extrabold text-[#1A2F4C]">AYUVARA Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#D6E6F2] flex items-center justify-center">
          <span className="text-sm font-bold text-[#1A2F4C]">DW</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Main (col-span-8) */}
        <section className="col-span-8 space-y-6">
          <div className="card p-4 bg-white shadow-md rounded-xl">
            <TodayDoses />
          </div>

          <div className="card p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-lg font-bold text-[#1A2F4C] mb-3">Medications</h2>
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-[#D6E6F2] rounded-lg p-2 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#38bdf8] rounded-full mb-2" />
                  <span className="text-xs font-semibold text-[#1A2F4C]">Med {i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-white shadow-md rounded-xl">
            <MoodLogger />
          </div>
        </section>

        {/* Right Sidebar (col-span-4) */}
        <aside className="col-span-4 space-y-6">
          {/* CCTV Live Feed */}
          <div className="card p-2 bg-[#1A2F4C] rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <Camera size={14} /> CCTV Live
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded ${cctvLive ? 'bg-green-600' : 'bg-red-600'} text-white`}>{cctvLive ? 'Live' : 'Paused'}</span>
            </div>
            {cctvLive ? (
              <img src="http://127.0.0.1:8081/mjpeg" alt="Live CCTV" className="w-full h-48 object-cover" />
            ) : (
              <div className="h-48 flex items-center justify-center text-white">Stream Paused</div>
            )}
          </div>

          {/* Floor‑Plan Snapshot */}
          <div className="card p-2 bg-white rounded-xl shadow">
            <h3 className="text-sm font-bold text-[#1A2F4C] mb-2 flex items-center gap-1">
              <MapPin size={14} /> Floor Plan
            </h3>
            <img src={roomImg} alt="Floor plan" className="w-full h-40 object-cover rounded" />
          </div>

          {/* Vitals Summary */}
          <div className="card p-4 bg-[#D6E6F2] rounded-xl shadow">
            <h3 className="text-sm font-bold text-[#1A2F4C] mb-3 flex items-center gap-1">
              <HeartPulse size={14} /> Vitals
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="block text-xs text-[#4A6B8F]">HR</span>
                <span className="text-xl font-bold text-[#1A2F4C]">72 BPM</span>
              </div>
              <div>
                <span className="block text-xs text-[#4A6B8F]">SpO₂</span>
                <span className="text-xl font-bold text-[#1A2F4C]">98 %</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

