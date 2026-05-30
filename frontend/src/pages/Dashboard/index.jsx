import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Scan, 
  Clock, 
  ShieldAlert,
  Brain,
  BarChart3,
  Zap
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { dashboardService } from '../../services/api.service'

const AnalyticsCard = ({ label, value, icon: Icon, color, trend, chartData }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -mr-12 -mt-12 rounded-full group-hover:bg-accent-cyan/10 transition-colors" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-slate-800/50 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
    </div>
    {/* Mini Graph Placeholder */}
    <div className="mt-4 h-10 w-full opacity-30 group-hover:opacity-60 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <Area type="monotone" dataKey="val" stroke="currentColor" fill="currentColor" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes, activityRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAnalytics(),
          dashboardService.getActivity()
        ])
        
        if (statsRes.success) setStatsData(statsRes.data)
        if (analyticsRes.success) setAnalytics(analyticsRes.data)
        if (activityRes.success) setActivity(activityRes.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    { 
      label: 'Total Inspections', 
      value: statsData?.total_inspections || '0', 
      icon: Scan, 
      color: 'text-accent-cyan', 
      trend: 'Total', 
      data: [{val: 10}, {val: 15}, {val: 8}, {val: 12}] 
    },
    { 
      label: 'Critical Cracks', 
      value: statsData?.critical_cracks || '0', 
      icon: AlertTriangle, 
      color: 'text-critical', 
      trend: 'Urgent', 
      data: [{val: 5}, {val: 4}, {val: 6}, {val: 4}] 
    },
    { 
      label: 'AI Confidence', 
      value: `${statsData?.avg_confidence || 0}%`, 
      icon: Brain, 
      color: 'text-accent-blue', 
      trend: 'Avg', 
      data: [{val: 95}, {val: 98}, {val: 97}, {val: 98}] 
    },
    { 
      label: 'Active Alerts', 
      value: statsData?.active_alerts || '0', 
      icon: ShieldAlert, 
      color: 'text-critical', 
      trend: 'Active', 
      data: [{val: 8}, {val: 10}, {val: 12}, {val: 12}] 
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-accent-cyan animate-pulse font-mono tracking-widest uppercase">Initializing Neural Feed...</div>
      </div>
    )
  }

  const severityData = analytics?.severity_distribution?.map(item => ({
    name: item.label,
    value: item.value,
    color: item.label === 'Critical' ? '#ef4444' : item.label === 'Moderate' ? '#f59e0b' : '#10b981'
  })) || []

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Infrastructure Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time structural telemetry & predictive analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-3 py-1.5 rounded-lg border border-accent-cyan/20">
            <Clock size={14} />
            LAST SYNC: {new Date().toLocaleTimeString()} UTC
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest animate-pulse">
            System Live
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <AnalyticsCard key={stat.label} {...stat} chartData={stat.data} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Health Area Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-cyan/10 text-accent-cyan rounded-lg">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Inspection Activity</h3>
                <p className="text-xs text-slate-500">Inspection volume by month</p>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthly_activity || []}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Gauge Widget */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Structural Severity Status</h3>
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData.length > 0 ? severityData : [{name: 'Empty', value: 1, color: '#1e293b'}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  {severityData.length === 0 && <Cell fill="#1e293b" />}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
              <span className="text-2xl font-bold text-white">{severityData.length > 0 ? 'Data' : 'None'}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Distribution</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
            {severityData.length === 0 && (
              <div className="text-xs text-slate-500 italic">No inspection data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Monitoring Panel */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Zap className="text-accent-cyan animate-pulse" size={20} />
              <h3 className="text-lg font-bold text-white tracking-tight">AI Neural Scan Feed</h3>
            </div>
          </div>
          
          <div className="aspect-video bg-slate-900 relative group">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Structural Scan"
            />
            <motion.div 
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-accent-cyan shadow-neon-cyan z-20"
            />
            <div className="absolute inset-0 bg-grid-overlay opacity-20" />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Clock className="text-slate-500" size={20} />
            <h3 className="text-lg font-bold text-white">Recent Inspections</h3>
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[450px]">
            {activity.length > 0 ? activity.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.severity === 'Critical' ? 'bg-critical' :
                    item.severity === 'Moderate' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1 w-px bg-white/5 my-2" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-white">{item.bridge_name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{new Date(item.created_at).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-[10px] text-slate-400">Severity: {item.severity} • Confidence: {item.confidence}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-500 text-xs italic">No recent activity detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
