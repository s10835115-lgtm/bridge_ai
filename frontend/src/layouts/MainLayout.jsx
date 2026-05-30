import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import NotificationSystem from '../components/common/NotificationSystem'
import { motion } from 'framer-motion'

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full -ml-64 -mb-64" />
        <div className="absolute inset-0 bg-grid-overlay opacity-20" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <NotificationSystem />
    </div>
  )
}

export default MainLayout
