import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Brain, 
  Monitor, 
  Shield, 
  Zap, 
  Globe, 
  Mail, 
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Palette,
  Smartphone
} from 'lucide-react'

const Settings = () => {
  const [aiSensitivity, setAiSensitivity] = useState(85)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    critical: true,
    reports: true
  })

  const sections = [
    { id: 'profile', icon: User, label: 'General Profile' },
    { id: 'notifications', icon: Bell, label: 'Alert System' },
    { id: 'ai', icon: Brain, label: 'Neural Configuration' },
    { id: 'theme', icon: Palette, label: 'Interface' },
    { id: 'security', icon: Lock, label: 'Security' }
  ]

  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-slate-500 mt-1">Enterprise-grade infrastructure control panel</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                activeSection === section.id 
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-neon-cyan' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <section.icon size={20} className={activeSection === section.id ? 'animate-pulse' : ''} />
              <span className="font-bold text-sm uppercase tracking-widest">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  <User size={20} className="text-accent-cyan" /> Organization Profile
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="full-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input id="full-name" name="full-name" type="text" defaultValue="Chief Engineer" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organization</label>
                    <input id="organization" name="organization" type="text" defaultValue="Global Infrastructure AI" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="regional-node" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Regional Node</label>
                    <select id="regional-node" name="regional-node" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none appearance-none">
                      <option>North America (East)</option>
                      <option>Europe (Central)</option>
                      <option>Asia Pacific (South)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Level</label>
                    <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-accent-cyan font-mono text-sm">LEVEL_4_AUTH_GRADED</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  <Bell size={20} className="text-accent-cyan" /> Alert Configuration
                </h3>
                <div className="space-y-6">
                  {[
                    { id: 'email', label: 'Email Telemetry Reports', icon: Mail, desc: 'Daily structural health summaries' },
                    { id: 'sms', label: 'SMS Critical Alerts', icon: Smartphone, desc: 'Immediate notification for severity > 80%' },
                    { id: 'critical', label: 'Push Notifications', icon: Zap, desc: 'Real-time neural detection alerts' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-accent-cyan/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-slate-800/50 text-accent-cyan">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notifications[item.id] ? 'bg-accent-cyan shadow-neon-cyan' : 'bg-slate-800'}`}
                      >
                        <motion.div 
                          animate={{ x: notifications[item.id] ? 24 : 4 }}
                          className={`absolute top-1 w-4 h-4 rounded-full ${notifications[item.id] ? 'bg-black' : 'bg-slate-500'}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'ai' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  <Brain size={20} className="text-accent-cyan" /> Neural Engine Parameters
                </h3>
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label htmlFor="ai-sensitivity" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detection Sensitivity</label>
                      <span className="text-accent-cyan font-mono text-xl font-bold">{aiSensitivity}%</span>
                    </div>
                    <input 
                      id="ai-sensitivity"
                      name="ai-sensitivity"
                      type="range" 
                      value={aiSensitivity} 
                      onChange={(e) => setAiSensitivity(e.target.value)}
                      className="w-full accent-accent-cyan bg-slate-800 h-1.5 rounded-full appearance-none cursor-pointer" 
                    />
                    <p className="text-[10px] text-slate-600 italic">Higher sensitivity may increase false-positive detection in varied lighting conditions.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="inference-model" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference Model</label>
                      <select id="inference-model" name="inference-model" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none">
                        <option>BridgeVision-V4-Pro (Stable)</option>
                        <option>Generative-Crack-v2-Alpha</option>
                        <option>Lidar-Fusion-Experimental</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reporting-frequency" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reporting Frequency</label>
                      <select id="reporting-frequency" name="reporting-frequency" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none">
                        <option>Real-time (Stream)</option>
                        <option>Hourly Batch</option>
                        <option>Daily Summary</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'theme' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  <Palette size={20} className="text-accent-cyan" /> Interface Customization
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-white">System Theme</p>
                    <div className="flex gap-4">
                      <button className="flex-1 glass-card p-4 border-accent-cyan shadow-neon-cyan text-center">
                        <Monitor size={24} className="mx-auto mb-2 text-accent-cyan" />
                        <span className="text-xs font-bold text-white">DARK MODE</span>
                      </button>
                      <button className="flex-1 glass-card p-4 text-center opacity-40 grayscale hover:grayscale-0 transition-all">
                        <Monitor size={24} className="mx-auto mb-2 text-slate-400" />
                        <span className="text-xs font-bold text-slate-400">LIGHT MODE</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-white">Visual Effects</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">UI Animations</span>
                        <div className="w-10 h-5 bg-accent-cyan rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Glow Effects</span>
                        <div className="w-10 h-5 bg-accent-cyan rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                  <Shield size={20} className="text-accent-cyan" /> Security Protocols
                </h3>
                <div className="space-y-8">
                  <div className="p-4 rounded-xl bg-critical/5 border border-critical/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-critical/10 text-critical">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500">Enhanced account protection is currently disabled.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-critical/10 border border-critical/20 text-critical text-xs font-bold rounded-lg hover:bg-critical/20 transition-all">ENABLE</button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Access Token</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-slate-500 font-mono text-xs flex items-center justify-between">
                        <span>br_ai_live_pk_****************************</span>
                        <EyeOff size={14} className="cursor-pointer hover:text-white" />
                      </div>
                      <button className="px-6 py-3 glass-card text-xs font-bold text-white hover:bg-white/5">ROTATE KEY</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button className="px-8 py-3 rounded-xl border border-white/5 text-slate-400 font-bold hover:text-white transition-all">DISCARD CHANGES</button>
            <button className="btn-primary">SAVE CONFIGURATION</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
