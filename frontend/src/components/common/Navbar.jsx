import { Search, Bell, User, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <header className="h-20 border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-6">
        <div className="relative w-full max-w-md group">
          <label htmlFor="global-search" className="sr-only">Search bridge systems</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" size={18} />
          <input 
            id="global-search"
            name="global-search"
            type="text" 
            placeholder="Search bridge systems..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Moon size={20} />
        </button>
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full shadow-[0_0_8px_#ef4444]" />
        </button>
        
        <div className="h-8 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-accent-cyan transition-colors">System Admin</p>
            <p className="text-[10px] text-slate-500">ID: AD-9923</p>
          </div>
          <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center group-hover:border-accent-cyan/50 transition-all">
            <User size={20} className="text-slate-300" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
