import { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { loadModel, detectClothing } from '../utils/aiModel'

const WebcamDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [currentConfidence, setCurrentConfidence] = useState<number>(0)
  
  const {
    isDetecting,
    setIsDetecting,
    currentDetection,
    setCurrentDetection,
    addDetection,
    settings,
    lastDetectionTime,
    setLastDetectionTime,
  } = useStore()

  // Initialiser le modèle IA
  useEffect(() => {
    const initModel = async () => {
      try {
        setIsLoading(true)
        await loadModel()
        setModelLoaded(true)
      } catch (err) {
        setError('Erreur lors du chargement du modèle IA')
        console.error('Erreur modèle:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    initModel()
  }, [])

  // Initialiser la webcam
  const startWebcam = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      setError('Impossible d\'accéder à la webcam. Vérifiez les permissions.')
      console.error('Erreur webcam:', err)
    }
  }, [])

  // Arrêter la webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Détecter les vêtements
  const performDetection = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelLoaded) return

    try {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      // Dessiner la frame vidéo sur le canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Détecter les vêtements
      const result = await detectClothing(canvas)
      
      if (result && result.confidence >= settings.confidenceThreshold) {
        // Mettre à jour la détection actuelle
        setCurrentDetection({
          clothing: result.clothing,
          glasses: result.glasses,
          hairType: result.hairType,
          hairColor: result.hairColor,
          accessories: result.accessories,
          facialHair: result.facialHair,
          age: result.age,
          gender: result.gender,
        })
        setCurrentConfidence(result.confidence)
        
        // Ajouter la détection complète au store
        const now = Date.now()
        if (!lastDetectionTime || now - lastDetectionTime > settings.detectionInterval) {
          addDetection({
            timestamp: now,
            clothing: result.clothing,
            glasses: result.glasses,
            hairType: result.hairType,
            hairColor: result.hairColor,
            accessories: result.accessories,
            facialHair: result.facialHair,
            age: result.age,
            gender: result.gender,
            confidence: result.confidence,
            details: result.details,
            image: settings.saveImages ? canvas.toDataURL() : undefined,
          })
          setLastDetectionTime(now)
        }
      } else {
        setCurrentDetection({
          clothing: null,
          glasses: null,
          hairType: null,
          hairColor: null,
          accessories: [],
          facialHair: null,
          age: null,
          gender: null,
        })
        setCurrentConfidence(0)
      }
    } catch (err) {
      console.error('Erreur détection:', err)
    }
  }, [modelLoaded, settings, lastDetectionTime, addDetection, setCurrentDetection, setLastDetectionTime])

  // Boucle de détection
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isDetecting && modelLoaded) {
      intervalId = setInterval(performDetection, 100) // Détection toutes les 100ms
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isDetecting, modelLoaded, performDetection])

  // Démarrer/arrêter la détection
  const toggleDetection = async () => {
    if (!isDetecting) {
      await startWebcam()
      setIsDetecting(true)
    } else {
      setIsDetecting(false)
      stopWebcam()
    }
  }

  // Nettoyage
  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [stopWebcam])

  const getClothingColor = (clothing: string | null) => {
    if (!clothing) return 'text-gray-500'
    if (clothing.toLowerCase().includes('t-shirt') || clothing.toLowerCase().includes('tshirt')) {
      return 'text-green-500'
    }
    return 'text-blue-500'
  }

  const getStatusIcon = () => {
    if (currentDetection.clothing?.toLowerCase().includes('t-shirt')) {
      return <CheckCircle className="text-green-500" size={24} />
    }
    return <AlertCircle className="text-blue-500" size={24} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analyseur de Personne IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Détection complète : vêtements, cheveux, lunettes, accessoires et plus
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${modelLoaded ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
              <Camera className={modelLoaded ? 'text-green-600' : 'text-yellow-600'} size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modèle IA</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {isLoading ? 'Chargement...' : modelLoaded ? 'Prêt' : 'Erreur'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vêtement</p>
              <p className={`font-semibold ${getClothingColor(currentDetection.clothing)}`}>
                {currentDetection.clothing || 'Non détecté'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <span className="text-purple-600 text-lg">👓</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lunettes</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {currentDetection.glasses || 'Non détecté'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <span className="text-blue-600 font-bold text-lg">
                {Math.round(currentConfidence * 100)}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Confiance</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Précision IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Détails de l'analyse */}
      {currentDetection.clothing && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analyse complète détectée
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">👕 Apparence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Vêtement:</span> {currentDetection.clothing}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Cheveux:</span> {currentDetection.hairColor} - {currentDetection.hairType}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Lunettes:</span> {currentDetection.glasses}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">🎭 Profil</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Âge estimé:</span> {currentDetection.age}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Genre:</span> {currentDetection.gender}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Pilosité:</span> {currentDetection.facialHair}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">💎 Accessoires</h4>
              {currentDetection.accessories.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {currentDetection.accessories.map((accessory, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {accessory}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">Aucun accessoire détecté</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Webcam Container */}
      <div className="card">
        <div className="webcam-container relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-96 object-cover"
            style={{ display: isDetecting ? 'block' : 'none' }}
          />
          
          {/* Canvas caché pour le traitement */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Placeholder quand pas de vidéo */}
          {!isDetecting && (
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <Camera size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Cliquez sur démarrer pour activer la webcam
                </p>
              </div>
            </div>
          )}
          
          {/* Overlay de détection */}
          {isDetecting && currentDetection.clothing && (
            <div className="webcam-overlay">
              <div className="absolute top-4 left-4 glass p-3 rounded-lg max-w-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <div>
                      <p className={`font-semibold ${getClothingColor(currentDetection.clothing)}`}>
                        {currentDetection.clothing}
                      </p>
                      <p className="text-sm text-white/80">
                        {Math.round(currentConfidence * 100)}% de confiance
                      </p>
                    </div>
                  </div>
                  
                  {/* Infos rapides */}
                  <div className="text-xs text-white/70 space-y-1">
                    {currentDetection.glasses && currentDetection.glasses !== 'Pas de lunettes' && (
                      <p>👓 {currentDetection.glasses}</p>
                    )}
                    {currentDetection.hairColor && currentDetection.hairColor !== 'Non détecté' && (
                      <p>💇 {currentDetection.hairColor}</p>
                    )}
                    {currentDetection.accessories.length > 0 && (
                      <p>💎 {currentDetection.accessories.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Contrôles */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={toggleDetection}
            disabled={isLoading || !modelLoaded}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isDetecting
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-gray-400'
            }`}
          >
            {isDetecting ? <Pause size={20} /> : <Play size={20} />}
            {isDetecting ? 'Arrêter' : 'Démarrer'}
          </button>
        </div>
      </div>

      {/* Erreurs */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Erreur</p>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WebcamDetector