import { motion } from 'framer-motion'
import { 
  Scan, 
  Activity, 
  ShieldCheck, 
  Bot, 
  LineChart, 
  Brain,
  Upload,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
    {/* Cyber Grid Background */}
    <div className="absolute inset-0 bg-grid-overlay opacity-20 pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    
    <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold tracking-widest uppercase mb-6"
        >
          <Zap size={14} className="animate-pulse" />
          Next-Gen Infrastructure Monitoring
        </motion.div>
        
        <h1 className="text-5xl lg:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
          AI-Powered Smart Bridge <span className="text-accent-gradient bg-clip-text text-transparent">Crack Detection</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-xl leading-relaxed mb-10">
          Advanced Generative AI system for intelligent bridge inspection, structural crack analysis, predictive maintenance, and infrastructure safety monitoring.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            Analyze Bridge <Scan size={18} />
          </Link>
          <Link to="/dashboard" className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 group">
            Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        {/* Animated Bridge Illustration Placeholder */}
        <div className="relative aspect-square max-w-[500px] mx-auto">
          <div className="absolute inset-0 bg-accent-blue/20 blur-[100px] rounded-full animate-pulse" />
          <div className="relative glass-card w-full h-full flex items-center justify-center p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-overlay opacity-30 group-hover:opacity-50 transition-opacity" />
            
            {/* Holographic Bridge Shape (SVG) */}
            <svg viewBox="0 0 200 200" className="w-full h-full text-accent-cyan/40">
              <motion.path
                d="M20,150 Q100,50 180,150"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <path d="M40,150 L40,120 M160,150 L160,120" stroke="currentColor" strokeWidth="2" />
              <motion.rect
                x="30" y="150" width="140" height="4"
                fill="currentColor"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
            </svg>

            {/* AI Scan Pulse */}
            <motion.div
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-accent-cyan shadow-neon-cyan z-20"
            />

            {/* Floating Indicators */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 right-1/4 glass-card p-3 scale-75 border-accent-cyan/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-critical animate-ping" />
                <span className="text-[10px] font-mono text-white">CRITICAL_CRACK_DETECTION</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

const FeaturesSection = () => {
  const features = [
    { icon: Scan, title: 'AI Crack Detection', desc: 'Computer vision algorithms trained on 100k+ structural images.' },
    { icon: Activity, title: 'Predictive Analysis', desc: 'Forecast structural degradation before it becomes critical.' },
    { icon: Bot, title: 'Drone Inspection', desc: 'Autonomous drone flight paths for multi-angle scanning.' },
    { icon: Cpu, title: 'Real-Time Monitoring', desc: 'IoT sensor integration for continuous telemetry stream.' },
    { icon: Brain, title: 'AI Recommendations', desc: 'GPT-powered maintenance strategy and repair guides.' },
    { icon: LineChart, title: 'Smart Analytics', desc: 'Deep insights into infrastructure longevity and ROI.' },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">Advanced Inspection Capabilities</h2>
          <p className="text-slate-400 leading-relaxed">
            Our platform leverages state-of-the-art AI to provide comprehensive structural health monitoring.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group hover:border-accent-cyan/50 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent-cyan mb-6 group-hover:bg-accent-cyan group-hover:text-black transition-colors shadow-neon-cyan">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const WorkflowSection = () => {
  const steps = [
    { label: 'Image Upload', icon: Upload },
    { label: 'Processing', icon: Cpu },
    { label: 'Detection', icon: Scan },
    { label: 'Analysis', icon: Activity },
    { label: 'GPT Strategy', icon: Brain },
    { label: 'Report', icon: LineChart },
  ]

  return (
    <section className="py-24 bg-card/20 border-y border-white/5">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-4xl font-heading font-bold text-white mb-20">Intelligent Workflow</h2>
        
        <div className="relative flex flex-wrap lg:flex-nowrap justify-between gap-8">
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/30 to-accent-cyan/0 -translate-y-1/2" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center gap-6 group"
            >
              <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-accent-cyan border-accent-cyan/20 group-hover:border-accent-cyan group-hover:shadow-neon-cyan transition-all">
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-blue text-[10px] font-bold text-white flex items-center justify-center border border-white/10">0{i+1}</span>
                {/* Dynamically get icon if needed, using placeholders for now */}
                <div className="animate-pulse"><CheckCircle2 size={24} /></div>
              </div>
              <p className="text-sm font-bold text-white tracking-widest uppercase">{step.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const StatsSection = () => {
  const stats = [
    { label: 'Inspections', value: '10K+' },
    { label: 'AI Accuracy', value: '98.7%' },
    { label: 'Bridges Monitored', value: '250+' },
    { label: 'Early Detection', value: '95%' },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-10 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-5xl font-heading font-extrabold text-white mb-2 neon-text-cyan">{stat.value}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TeamSection = () => {
  const team = [
    { name: 'Dr. Sarah Chen', role: 'AI Lead Engineer', img: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Marcus Rodriguez', role: 'Structural Analyst', img: 'https://i.pravatar.cc/150?u=marcus' },
    { name: 'Aisha Kahn', role: 'Drone Operations', img: 'https://i.pravatar.cc/150?u=aisha' },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-heading font-bold text-white mb-20">The Engineering Team</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div key={member.name} whileHover={{ y: -10 }} className="group">
              <div className="relative mb-6 mx-auto w-48 h-48 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-accent-cyan/50 transition-all shadow-xl">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
              <p className="text-accent-cyan text-sm font-bold uppercase tracking-widest mb-4">{member.role}</p>
              <div className="flex justify-center gap-4 text-slate-500">
                <Github size={20} className="hover:text-white transition-colors cursor-pointer" />
                <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
                <Linkedin size={20} className="hover:text-white transition-colors cursor-pointer" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="py-12 bg-card border-t border-white/5 backdrop-blur-xl">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-4 gap-12 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-neon-blue">
              <Activity className="text-white" size={24} />
            </div>
            <span className="font-heading font-bold text-2xl text-white">Bridge<span className="text-accent-cyan">AI</span></span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Leading the future of structural infrastructure through generative artificial intelligence and autonomous monitoring systems.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><Link to="/dashboard" className="hover:text-accent-cyan transition-colors">Dashboard</Link></li>
            <li><Link to="/upload" className="hover:text-accent-cyan transition-colors">Analysis</Link></li>
            <li><Link to="/reports" className="hover:text-accent-cyan transition-colors">Reports</Link></li>
            <li><Link to="/analytics" className="hover:text-accent-cyan transition-colors">Predictive Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Connect</h4>
          <div className="flex gap-4 text-slate-400">
            <Github size={24} className="hover:text-white cursor-pointer transition-colors" />
            <Linkedin size={24} className="hover:text-white cursor-pointer transition-colors" />
            <Twitter size={24} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-600 text-xs">© 2026 BridgeAI Systems. Production-quality AI Laboratory Project.</p>
        <div className="flex gap-8 text-slate-600 text-xs font-bold tracking-widest uppercase">
          <span>Terms</span>
          <span>Privacy</span>
          <span>System Status</span>
        </div>
      </div>
    </div>
  </footer>
)

const Home = () => {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <StatsSection />
      <TeamSection />
      <Footer />
    </div>
  )
}

export default Home
