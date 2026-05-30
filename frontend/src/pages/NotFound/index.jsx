import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw, Zap } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-grid-overlay" />
      </div>

      <div className="relative z-10 text-center space-y-12">
        {/* Broken Bridge Hologram Illustration */}
        <div className="relative w-64 h-64 mx-auto">
          <motion.div
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [1, 1.05, 1],
              filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-accent-cyan/20"
          >
            <Zap size={256} strokeWidth={0.5} />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="glass-card p-6 border-critical/30 bg-critical/5 shadow-neon-blue"
            >
              <AlertTriangle size={64} className="text-critical animate-pulse" />
            </motion.div>
          </div>

          {/* Glitch Effects */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], x: [-2, 2, -2] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute top-10 left-0 w-full h-px bg-accent-cyan shadow-neon-cyan opacity-50"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-heading font-black text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-accent-cyan tracking-widest uppercase">Structural Node Not Found</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed italic">
            The requested infrastructure coordinate does not exist in the neural registry or has been decommissioned from the system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2 px-8 py-4">
            <Home size={20} /> RETURN TO TERMINAL
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 group"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" /> REBOOT SESSION
          </button>
        </div>

        <div className="pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-critical/10 border border-critical/20 text-critical text-[10px] font-bold tracking-widest uppercase">
            ERROR_LOG: 0x404_NULL_REFERENCE
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
