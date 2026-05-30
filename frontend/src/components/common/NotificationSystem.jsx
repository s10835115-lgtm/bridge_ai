import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Zap, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', msg: 'CRITICAL: Severe fatigue detected on Brooklyn Pylon-4', time: 'Just now' },
    { id: 2, type: 'success', msg: 'Neural model BridgeVision-V4 synchronized successfully', time: '2m ago' }
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== 1))
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className={`glass-card p-4 min-w-[320px] flex items-start gap-4 border-l-4 shadow-2xl relative overflow-hidden group ${
              n.type === 'critical' ? 'border-l-critical bg-critical/5' : 
              n.type === 'warning' ? 'border-l-warning bg-warning/5' : 'border-l-success bg-success/5'
            }`}>
              <div className="absolute inset-0 bg-grid-overlay opacity-10" />
              
              <div className={`p-2 rounded-lg ${
                n.type === 'critical' ? 'bg-critical/10 text-critical' : 
                n.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
              }`}>
                {n.type === 'critical' ? <ShieldAlert size={18} /> : 
                 n.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-white leading-tight">{n.msg}</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{n.time}</p>
              </div>

              <button 
                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                className="p-1 hover:bg-white/5 rounded-md text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem
