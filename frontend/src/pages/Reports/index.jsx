import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  X,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { reportService } from '../../services/api.service'
import SafeImage from '../../components/common/SafeImage'

const API_BASE_URL = 'http://localhost:5001'

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              report.severity === 'Critical' ? 'bg-critical/10 text-critical' :
              report.severity === 'Moderate' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{report.bridge_name}</h2>
              <p className="text-slate-500 font-mono text-xs">REPORT_ID: {report.id}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass-card aspect-video relative overflow-hidden group">
                <SafeImage 
                  src={`${API_BASE_URL}/uploads/${report.image_path}`}
                  fallback="https://images.unsplash.com/photo-1590060417673-42826012166a?auto=format&fit=crop&q=80&w=800"
                  alt="Structural Detail"
                  className="w-full h-full opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-accent-cyan/10 pointer-events-none" />
                <div className="absolute bottom-4 left-4 glass-card px-2 py-1 text-[10px] font-bold text-white/50">AI_STRUCTURAL_SCAN</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Crack Width</span>
                  <span className="text-xl font-bold text-white">{report.crack_width || 'N/A'}</span>
                </div>
                <div className="glass-card p-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">AI Confidence</span>
                  <span className="text-xl font-bold text-accent-cyan">{report.confidence}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6 border-accent-cyan/20 bg-accent-cyan/5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-accent-cyan" /> AI Structural Assessment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                  {report.summary || "No summary available."}
                </p>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Strategy</h4>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300">
                    {report.recommendation || "Maintain routine monitoring protocol."}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-4">Inspection Meta</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 uppercase">Risk Level</span>
                    <span className="text-white font-bold">{report.risk_level}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 uppercase">Created At</span>
                    <span className="text-white font-mono">{new Date(report.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {report.report_path && (
              <a 
                href={`${API_BASE_URL}/${report.report_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <Download size={18} /> DOWNLOAD FULL REPORT
              </a>
            )}
            <button className="px-6 py-3 glass-card hover:bg-white/5 text-white font-bold transition-all">
              SHARE ANALYSIS
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getReports()
        if (res.success) {
          setReports(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = reports.filter(r => 
    r.bridge_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Inspection Reports</h1>
          <p className="text-slate-500 mt-1">Enterprise-grade structural data management</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <label htmlFor="report-search-field" className="sr-only">Search reports</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" size={18} />
            <input 
              id="report-search-field"
              name="report-search-field"
              type="text" 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card/40 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all w-64"
            />
          </div>
          <button className="glass-card px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all">
            <Filter size={18} /> FILTERS
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-accent-cyan font-mono animate-pulse uppercase tracking-widest">
            Accessing Secure Archives...
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bridge Name</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Severity</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Confidence</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReports.map((report) => (
                  <motion.tr 
                    key={report.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="group transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{report.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{report.bridge_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        report.severity === 'Critical' ? 'bg-critical/10 text-critical border border-critical/20' :
                        report.severity === 'Moderate' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-accent-cyan font-mono">{report.confidence}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-accent-cyan transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-slate-500 italic">No matching reports found in the neural archives.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Reports
