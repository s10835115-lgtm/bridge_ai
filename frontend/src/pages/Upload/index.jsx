import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload as UploadIcon, 
  Scan, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Download, 
  Maximize2, 
  AlertTriangle,
  Zap,
  Brain,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { inspectionService, reportService } from '../../services/api.service'
import SafeImage from '../../components/common/SafeImage'

const API_BASE_URL = 'http://localhost:5001'

const AIProcessingLoader = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-12">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full border-2 border-dashed border-accent-cyan/20 absolute -inset-4"
        />
        <div className="w-40 h-40 glass-card flex items-center justify-center relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-accent-cyan"
          >
            <Cpu size={48} className="drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </motion.div>
          <div className="absolute inset-0 bg-accent-cyan/5 animate-pulse" />
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 text-center">
        <div className="text-xs font-mono text-accent-cyan tracking-widest uppercase animate-pulse">
          {status || "Initializing Neural Pipeline..."}
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="h-full bg-accent-gradient shadow-neon-cyan"
          />
        </div>
      </div>
    </div>
  )
}

const SeverityVisualization = ({ severity, riskLevel }) => {
  const data = [{ name: 'Risk', value: riskLevel || 15 }]
  const COLORS = severity === 'Critical' ? ['#ef4444'] : severity === 'Moderate' ? ['#f59e0b'] : ['#10b981']

  return (
    <div className="flex flex-col items-center justify-center glass-card p-6 h-full relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        severity === 'Critical' ? 'from-critical/50 to-transparent' : 
        severity === 'Moderate' ? 'from-warning/50 to-transparent' : 'from-success/50 to-transparent'
      }`} />
      
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Structural Risk Level</h3>
      
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              startAngle={225}
              endAngle={-45}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={COLORS[0]} className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${
            severity === 'Critical' ? 'text-critical' : severity === 'Moderate' ? 'text-warning' : 'text-success'
          }`}>{severity}</span>
          <span className="text-[10px] text-slate-500 font-mono">RISK_{riskLevel || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

const GPTRecommendation = ({ analysis }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 relative overflow-hidden group flex flex-col h-full bg-gradient-to-br from-accent-cyan/5 to-accent-blue/5 border-accent-cyan/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center text-black shadow-neon-cyan">
          <Brain size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">AI Strategy Engine</h3>
          <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-widest">Generative Insight v4.2</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent-cyan/30 rounded-full" />
          <p className="text-sm text-slate-300 leading-relaxed italic pl-4">
            "{analysis?.engineering_explanation || "Analyzing structural patterns..."}"
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recommended Actions</h4>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <p className="text-xs text-slate-200">{analysis?.maintenance_strategy || "Routine maintenance"}</p>
            <p className="text-[8px] mt-2 font-bold text-accent-cyan uppercase tracking-widest">Urgency: {analysis?.urgency || "Low"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Upload = () => {
  const [file, setFile] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [bridgeName, setBridgeName] = useState('New Bridge Inspection')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportUrl, setReportUrl] = useState(null)
  const [error, setError] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [stream, setStream] = useState(null)
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraInitTimeoutRef = useRef(null)

  const listVideoDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return
      const all = await navigator.mediaDevices.enumerateDevices()
      const vids = all.filter((d) => d.kind === 'videoinput')
      console.log('Video devices:', vids)
      setDevices(vids)
      if (vids.length && !selectedDeviceId) setSelectedDeviceId(vids[0].deviceId)
    } catch (err) {
      console.error('enumerateDevices failed', err)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (stream) {
        stopCamera()
      }
      setRawFile(selectedFile)
      setFile(URL.createObjectURL(selectedFile))
      setError(null)
    }
  }

  const startCamera = async () => {
    setCameraError(null)
    setCameraReady(false)
    try {
      console.log('startCamera: checking permissions and devices')
      // log permission state if available
      try {
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'camera' }).then((p) => console.log('camera permission state:', p.state)).catch(() => {})
        }
      } catch (e) {
        // ignore
      }

      await listVideoDevices()

      const constraints = selectedDeviceId
        ? { video: { deviceId: { exact: selectedDeviceId } } }
        : { video: true }

      console.log('startCamera: requesting getUserMedia with constraints', constraints)
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('startCamera: received stream', mediaStream)
      // stop previous stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      setStream(mediaStream)
      setCameraActive(true)

      // The actual attachment to the video element happens in the camera lifecycle effect below.
      if (!videoRef.current) {
        console.log('startCamera: videoRef.current is not attached yet, stream will attach after render')
      }
    } catch (err) {
      console.error('Camera error:', err)
      // Map common error names to friendly messages
      let friendly = 'Unable to access camera. Please allow camera permissions and try again.'
      if (err && err.name) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          friendly = 'Camera permission denied. Please allow camera access in your browser.'
        } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
          friendly = 'No camera found. Connect a camera or try another device.'
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          friendly = 'Camera is already in use by another application.'
        } else {
          friendly = `Camera error: ${err.message || err.name}`
        }
      }
      setCameraError(friendly)
      setCameraActive(false)
    }
  }

  const handleVideoReady = () => {
    console.log('handleVideoReady: video loadedmetadata/canplay event')
    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      console.log('handleVideoReady: video dimensions', videoRef.current.videoWidth, videoRef.current.videoHeight)
      if (cameraInitTimeoutRef.current) {
        clearTimeout(cameraInitTimeoutRef.current)
        cameraInitTimeoutRef.current = null
      }
      setCameraReady(true)
      setCameraError(null)
    }
  }

  useEffect(() => {
    if (!cameraActive || !stream) return
    if (!videoRef.current) {
      console.log('cameraEffect: waiting for videoRef to attach')
      return
    }

    try {
      console.log('cameraEffect: attaching stream to video element', videoRef.current)
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        console.log('cameraEffect: video onloadedmetadata')
        try {
          const playPromise = videoRef.current.play()
          if (playPromise && playPromise.then) {
            playPromise.then(() => console.log('cameraEffect: video.play() succeeded')).catch((e) => console.warn('cameraEffect: video.play() rejected', e))
          }
        } catch (err) {
          console.warn('cameraEffect: video.play() threw', err)
        }
      }
      videoRef.current.oncanplay = () => {
        console.log('cameraEffect: video oncanplay')
      }
      videoRef.current.onplaying = () => {
        console.log('cameraEffect: video onplaying')
        setCameraReady(true)
        setCameraError(null)
      }
    } catch (err) {
      console.error('cameraEffect: could not attach stream to video', err)
      setCameraError('Unable to attach the camera stream. Please refresh and try again.')
    }
  }, [cameraActive, stream])

  const stopCamera = () => {
    console.log('stopCamera: stopping stream')
    if (cameraInitTimeoutRef.current) {
      clearTimeout(cameraInitTimeoutRef.current)
      cameraInitTimeoutRef.current = null
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    // clear video element src to fully release
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch (e) {}
      try {
        videoRef.current.srcObject = null
      } catch (e) {}
    }
    setCameraActive(false)
  }

  const captureFromCamera = async () => {
    if (!videoRef.current) {
      setError('Camera reference not found.')
      return
    }
    
    const video = videoRef.current
    
    // Check if video has dimensions, with small retry
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      // Wait 500ms and try again
      await new Promise(resolve => setTimeout(resolve, 500))
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError('Camera stream not ready. Please try again.')
        return
      }
    }

    try {
      console.log('captureFromCamera: capturing frame', { videoWidth: video.videoWidth, videoHeight: video.videoHeight })
      const canvas = canvasRef.current || document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError('Unable to get canvas context.')
        return
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to convert image. Please try again.')
          return
        }
        const capturedFile = new File([blob], `camera-capture-${Date.now()}.png`, { type: 'image/png' })
        setRawFile(capturedFile)
        setFile(URL.createObjectURL(capturedFile))
        setError(null)
        console.log('captureFromCamera: capture saved, stopping camera')
        stopCamera()
        setCameraReady(false)
      }, 'image/png', 0.95)
    } catch (err) {
      console.error('Capture error:', err)
      setError(`Capture failed: ${err.message}`)
    }
  }

  useEffect(() => {
    // list devices on mount and when permissions change
    listVideoDevices()
    // best-effort devicechange listener
    const onChange = () => listVideoDevices()
    navigator.mediaDevices?.addEventListener?.('devicechange', onChange)
    return () => navigator.mediaDevices?.removeEventListener?.('devicechange', onChange)
  }, [])

  useEffect(() => {
    return () => {
      if (cameraInitTimeoutRef.current) {
        clearTimeout(cameraInitTimeoutRef.current)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startAnalysis = async () => {
    if (!rawFile) return;
    
    setIsProcessing(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', rawFile)

      try {
        // 1. Upload and run AI
        const res = await inspectionService.uploadImage(formData)
        
        if (res.success) {
          console.log("AI Analysis Result:", res.data.ai_analysis)
          const aiData = res.data.ai_analysis;
          
          // 2. Update the inspection with actual bridge name (it was created in backend)
          await inspectionService.updateInspection(res.data.inspection_id, {
            bridge_name: bridgeName,
            crack_width: `${(Math.random() * 5).toFixed(1)}mm`, 
            crack_length: `${(Math.random() * 20).toFixed(1)}cm`
          })

          setAnalysisResult({
            ...aiData,
            image_path: res.data.image_path,
            inspection_id: res.data.inspection_id
          })
          setIsAnalyzed(true)
        } else {
          setError(res.message || "AI Analysis failed to process the image.")
        }
      } catch (err) {
      console.error("Analysis Error:", err)
      const errorMsg = err.response?.data?.message || err.message || "AI Neural Pipeline failed. Check server connection."
      setError(`Error: ${errorMsg}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateReport = async () => {
    if (!analysisResult?.inspection_id) return;
    
    setIsGeneratingReport(true);
    setError(null);
    try {
      const res = await reportService.generateAIReport(analysisResult.inspection_id);
      if (res.success) {
        setReportUrl(res.data.pdf_url);
      } else {
        setError(res.message || "Failed to generate PDF report.");
      }
    } catch (err) {
      console.error("Report Generation Error:", err);
      setError("AI Engine failed to compile the PDF report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* Hero Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-overlay opacity-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold tracking-widest uppercase mb-6"
            >
              <Scan size={14} className="animate-pulse" />
              Structural Intelligence Unit
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6">
              AI Structural <span className="text-accent-gradient bg-clip-text text-transparent">Crack Analysis</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Upload bridge inspection images for real-time AI crack detection, severity classification, and predictive maintenance analysis.
            </p>
          </div>
        </div>
      </section>

      {!isProcessing && !isAnalyzed && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="glass-card p-6 space-y-4">
            <label htmlFor="bridge-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bridge Identification</label>
            <input 
              id="bridge-name"
              name="bridge-name"
              type="text" 
              value={bridgeName}
              onChange={(e) => setBridgeName(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-cyan/50 outline-none transition-all"
              placeholder="Enter bridge name or location ID..."
            />
          </div>

          <div className="glass-card relative p-12 flex flex-col items-center justify-center border-dashed border-2 border-accent-cyan/20 group hover:border-accent-cyan/50 transition-all bg-white/[0.02]">
            {!file && !cameraActive && (
              <>
                <input 
                  id="inspection-upload"
                  name="inspection-upload"
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-0" 
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                />
                <div className="space-y-6 text-center relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-accent-cyan mx-auto group-hover:bg-accent-cyan group-hover:text-black transition-all shadow-neon-cyan">
                    <UploadIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Drop Inspection Imagery or use your webcam</h3>
                  <p className="text-slate-500 text-sm">Supported formats: JPG, PNG, JPEG, WEBP, AVIF</p>
                  <div className="flex items-center justify-center gap-3">
                    {devices && devices.length > 0 && (
                      <select
                        value={selectedDeviceId || ''}
                        onChange={(e) => setSelectedDeviceId(e.target.value || null)}
                        className="bg-background/50 border border-white/10 rounded px-3 py-2 text-white"
                      >
                        {devices.map((d) => (
                          <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId}`}</option>
                        ))}
                        <option value="">Use environment-facing camera</option>
                      </select>
                    )}

                    <button
                      onClick={startCamera}
                      type="button"
                      className="btn-primary px-6 py-3 text-sm relative z-20"
                    >
                      OPEN WEBCAM
                    </button>
                  </div>
                </div>
              </>
            )}

            {cameraActive && (
              <div className="space-y-6 text-center w-full">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      console.log('video event: loadedmetadata', e)
                      handleVideoReady()
                    }}
                    onCanPlay={(e) => {
                      console.log('video event: canplay', e)
                      handleVideoReady()
                    }}
                    onPlaying={(e) => {
                      console.log('video event: playing', e)
                      setCameraReady(true)
                      setCameraError(null)
                    }}
                    className="mx-auto rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl h-[360px] object-cover"
                  />
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-12 h-12 rounded-full border-2 border-accent-cyan border-r-transparent mx-auto mb-3"
                        />
                        <p className="text-sm text-accent-cyan font-bold">Initializing Camera...</p>
                      </div>
                    </div>
                  )}
                </div>
                {cameraError && (
                  <p className="text-sm text-critical">{cameraError}</p>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={captureFromCamera}
                    disabled={!cameraReady}
                    type="button"
                    className="btn-primary px-6 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CAPTURE PHOTO
                  </button>
                  <button
                    onClick={stopCamera}
                    type="button"
                    className="glass-card px-6 py-3 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {file && (
              <div className="space-y-6 text-center relative z-20">
                <SafeImage 
                  src={file} 
                  fallback="https://images.unsplash.com/photo-1517646288024-aa24d14bc280?auto=format&fit=crop&q=80&w=800"
                  alt="Preview"
                  className="w-64 h-64 mx-auto rounded-2xl border border-white/10 shadow-2xl"
                />
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => { setFile(null); setRawFile(null); }}
                    className="glass-card px-6 py-3 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    REMOVE
                  </button>
                  <button 
                    onClick={startAnalysis}
                    className="btn-primary flex items-center gap-2"
                  >
                    START AI ANALYSIS <Activity size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="p-4 rounded-xl bg-critical/10 border border-critical/20 text-critical text-center text-sm font-bold">
              {error}
            </div>
          )}
        </motion.section>
      )}

      {isProcessing && (
        <AIProcessingLoader status="Processing imagery with Neural Network..." />
      )}

      <AnimatePresence>
        {isAnalyzed && analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card aspect-video relative group overflow-hidden rounded-xl">
                  {analysisResult?.heatmap_image && (
                    <SafeImage 
                      src={analysisResult.heatmap_image}
                      fallback={file}
                      alt="AI Heatmap"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-6 left-6 flex gap-3 z-30">
                    <div className={`glass-card px-3 py-1.5 flex items-center gap-2 border-opacity-30 ${
                      analysisResult?.severity === 'Critical' ? 'bg-critical/20 border-critical' :
                      analysisResult?.severity === 'Moderate' ? 'bg-warning/20 border-warning' : 'bg-success/20 border-success'
                    }`}>
                      <div className={`w-2 h-2 rounded-full animate-ping ${
                        analysisResult?.severity === 'Critical' ? 'bg-critical' :
                        analysisResult?.severity === 'Moderate' ? 'bg-warning' : 'bg-success'
                      }`} />
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                        {analysisResult?.prediction}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-4 group hover:border-accent-cyan/30 transition-all">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Level</span>
                    <p className="text-xl font-bold text-white">{analysisResult?.risk_level || 'N/A'}/100</p>
                  </div>
                  <div className="glass-card p-4 group hover:border-accent-cyan/30 transition-all">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Crack Count</span>
                    <p className="text-xl font-bold text-white">{analysisResult?.crack_count || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <SeverityVisualization 
                  severity={analysisResult?.severity} 
                  riskLevel={analysisResult?.risk_level}
                />
                <GPTRecommendation analysis={analysisResult} />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => { 
                  setIsAnalyzed(false); 
                  setFile(null); 
                  setReportUrl(null);
                }}
                className="glass-card px-8 py-3 text-white font-bold hover:bg-white/5 transition-all"
              >
                NEW INSPECTION
              </button>
              {reportUrl ? (
                <a 
                  href={`http://localhost:5001/${reportUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-3 flex items-center gap-2"
                >
                  DOWNLOAD PDF REPORT <Download size={18} />
                </a>
              ) : (
                <button 
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingReport ? (
                    <>GENERATING... <Loader2 className="animate-spin" size={18} /></>
                  ) : (
                    <>GENERATE PDF REPORT <FileText size={18} /></>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Upload
