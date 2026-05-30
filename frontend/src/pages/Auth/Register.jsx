import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, User, Shield } from 'lucide-react'
import { authService } from '../../services/api.service'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passcodes do not match.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authService.register({
        name: formData.username,
        email: formData.email,
        password: formData.password
      })
      if (res.success) {
        navigate('/login')
      } else {
        setError(res.message)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Neural registration failed. Server connection error."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-overlay opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-blue flex items-center justify-center text-black shadow-neon-blue mb-6">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Identity</h1>
          <p className="text-slate-500 text-sm mt-2">Initialize new operative credentials</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Callsign (Username)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" size={18} />
              <input 
                id="username"
                name="username"
                type="text" 
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all"
                placeholder="Chief_Engineer_01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" size={18} />
              <input 
                id="email"
                name="email"
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all"
                placeholder="engineer@infrastructure.ai"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Passcode</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" size={18} />
              <input 
                id="password"
                name="password"
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Passcode</label>
            <div className="relative group">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" size={18} />
              <input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-critical/10 border border-critical/20 text-critical text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary bg-accent-blue hover:bg-accent-blue/80 py-4 flex items-center justify-center gap-2 group"
          >
            INITIALIZE IDENTITY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs">
            Already registered? <button onClick={() => navigate('/login')} className="text-accent-blue font-bold hover:underline">Access Uplink</button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
