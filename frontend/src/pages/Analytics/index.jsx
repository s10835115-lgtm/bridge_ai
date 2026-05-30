import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar,
  Filter,
  Download,
  Activity,
  Zap,
  Brain
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'
import { dashboardService } from '../../services/api.service'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await dashboardService.getAnalytics()
        if (res.success) {
          setAnalytics(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-accent-cyan animate-pulse font-mono tracking-widest uppercase">Fetching Historical Data...</div>
      </div>
    )
  }

  const severityData = analytics?.severity_distribution?.map(item => ({
    name: item.label,
    value: item.value,
    color: item.label === 'Critical' ? '#ef4444' : item.label === 'Moderate' ? '#f59e0b' : '#10b981'
  })) || []

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Center</h1>
          <p className="text-slate-500 mt-1">Deep structural intelligence & historical trends</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all">
            <Calendar size={18} /> LAST 30 DAYS
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} /> EXPORT DATA
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Trend */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-accent-cyan/10 text-accent-cyan rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Activity Trend</h3>
              <p className="text-xs text-slate-500">Inspection volume across time</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthly_activity || []}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-critical/10 text-critical rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Severity Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of structural risks</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Matrix (Radar) */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Structural Health Matrix</h3>
              <p className="text-xs text-slate-500">Multi-dimensional integrity score</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: 'Deck', A: 85, fullMark: 100 },
                { subject: 'Pylon', A: 92, fullMark: 100 },
                { subject: 'Cables', A: 78, fullMark: 100 },
                { subject: 'Foundation', A: 95, fullMark: 100 },
                { subject: 'Joints', A: 70, fullMark: 100 },
              ]}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis stroke="#64748b" fontSize={10} angle={30} domain={[0, 100]} />
                <Radar name="Integrity" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Cost Projection */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Maintenance Forecasting</h3>
              <p className="text-xs text-slate-500">Projected resource allocation</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Jul', cost: 1200 },
                { month: 'Aug', cost: 1800 },
                { month: 'Sep', cost: 1400 },
                { month: 'Oct', cost: 2200 },
                { month: 'Nov', cost: 2800 },
                { month: 'Dec', cost: 2400 },
              ]}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="step" dataKey="cost" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
