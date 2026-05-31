import { useEffect, useRef, useState } from 'react'

const CameraTest = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [capturedUrl, setCapturedUrl] = useState(null)
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const initTimeoutRef = useRef(null)

  const listVideoDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return
      const all = await navigator.mediaDevices.enumerateDevices()
      const vids = all.filter((d) => d.kind === 'videoinput')
      setDevices(vids)
      // auto-select the first device if not chosen
      if (vids.length && !selectedDeviceId) setSelectedDeviceId(vids[0].deviceId)
    } catch (err) {
      console.error('enumerateDevices error', err)
    }
  }

  const startCamera = async () => {
    setCameraError(null)
    setCameraReady(false)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser does not support camera access.')
        return
      }

      // Choose constraints: prefer explicit deviceId when available
      const constraints = selectedDeviceId
        ? { video: { deviceId: { exact: selectedDeviceId } } }
        : { video: { facingMode } }

      const s = await navigator.mediaDevices.getUserMedia(constraints)
      // stop previous stream if any
      if (stream) stream.getTracks().forEach((t) => t.stop())
      setStream(s)
      setCameraActive(true)
      if (videoRef.current) videoRef.current.srcObject = s

      // readiness fallback: check for dimensions within 5s
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = setTimeout(() => {
        const v = videoRef.current
        if (v && v.videoWidth > 0 && v.videoHeight > 0) {
          setCameraReady(true)
          setCameraError(null)
        } else {
          setCameraError('Camera not responding. Check permissions or try another device.')
          stopCamera()
        }
      }, 5000)
    } catch (err) {
      console.error('startCamera error', err)
      const friendly = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Camera permission denied. Allow access in browser.'
        : err.name === 'NotFoundError' || err.name === 'OverconstrainedError'
        ? 'No compatible camera found for the selected constraints.'
        : `Camera error: ${err.message || err.name}`
      setCameraError(friendly)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = null
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    setCameraActive(false)
    setCameraReady(false)
  }

  const handleVideoReady = () => {
    if (!videoRef.current) return
    if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
      setCameraReady(true)
      setCameraError(null)
    }
  }

  const toggleFacing = async () => {
    setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))
    setSelectedDeviceId(null)
    stopCamera()
    setTimeout(() => startCamera(), 250)
  }

  const capture = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current || document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setCapturedUrl(url)
    }, 'image/png', 0.95)
  }

  useEffect(() => {
    listVideoDevices()
    // re-list when permissions change (best-effort)
    const onChange = () => listVideoDevices()
    navigator.mediaDevices?.addEventListener?.('devicechange', onChange)
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', onChange)
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current)
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold text-white">Camera Test</h2>

      <div className="glass-card p-4">
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <label className="text-sm text-slate-300">Video device</label>
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDeviceId(e.target.value || null)}
              className="bg-background/50 border border-white/10 rounded px-3 py-2 text-white"
            >
              {devices.length === 0 && <option value="">No devices found</option>}
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId}`}</option>
              ))}
              <option value="">Use facingMode ({facingMode})</option>
            </select>
          </div>

          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleVideoReady}
              onCanPlay={handleVideoReady}
              className="w-full rounded-lg bg-black"
            />
            {!cameraReady && cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm text-accent-cyan font-bold">Initializing camera...</div>
              </div>
            )}
          </div>

          {cameraError && <div className="text-critical">{cameraError}</div>}

          <div className="flex gap-3 flex-wrap">
            <button onClick={startCamera} className="btn-primary px-4 py-2" disabled={cameraActive}>Start</button>
            <button onClick={stopCamera} className="glass-card px-4 py-2" disabled={!cameraActive}>Stop</button>
            <button onClick={toggleFacing} className="glass-card px-4 py-2">Switch Camera</button>
            <button onClick={capture} className="btn-primary px-4 py-2" disabled={!cameraReady}>Capture</button>
            {capturedUrl && (
              <a href={capturedUrl} download="capture.png" className="glass-card px-4 py-2">Download</a>
            )}
          </div>

          {capturedUrl && (
            <div className="mt-4">
              <img src={capturedUrl} alt="capture" className="w-full rounded-lg border" />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}

export default CameraTest
