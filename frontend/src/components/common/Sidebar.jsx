import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BarChart3, 
  Settings, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-card border-r border-white/5 flex flex-col relative z-50 transition-all duration-300 ease-in-out"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-neon-blue shrink-0">
          <Activity className="text-white" size={24} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="font-heading font-bold text-xl tracking-tight text-white whitespace-nowrap"
            >
              Crack<span className="text-accent-cyan">Ai</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-neon-cyan' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}
            `}
          >
            <item.icon size={22} className="shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-accent-cyan rounded-full flex items-center justify-center text-black shadow-neon-cyan z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* User Info */}
      <div className="p-4 border-t border-white/5 bg-background/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Admin User</span>
              <span className="text-[10px] text-accent-cyan uppercase tracking-wider">Level 4 Access</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
