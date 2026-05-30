import { useState } from 'react'
import { Activity } from 'lucide-react'

const SafeImage = ({ src, fallback, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <Activity className="text-accent-cyan animate-spin" size={24} />
        </div>
      )}
      <img
        src={isError ? fallback : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!isError) {
            setIsError(true)
            setIsLoaded(true)
          }
        }}
      />
    </div>
  )
}

export default SafeImage
