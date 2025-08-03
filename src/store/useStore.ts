import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Detection {
  id: string
  timestamp: number
  clothing: string
  confidence: number
  image?: string
}

export interface Settings {
  confidenceThreshold: number
  detectionInterval: number
  saveImages: boolean
  notifications: boolean
}

interface Store {
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void
  
  // Détections
  detections: Detection[]
  addDetection: (detection: Omit<Detection, 'id'>) => void
  clearDetections: () => void
  
  // Statistiques
  stats: {
    totalDetections: number
    tshirtCount: number
    otherCount: number
    averageConfidence: number
  }
  updateStats: () => void
  
  // Paramètres
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  
  // État de l'application
  isDetecting: boolean
  setIsDetecting: (detecting: boolean) => void
  
  currentClothing: string | null
  setCurrentClothing: (clothing: string | null) => void
  
  lastDetectionTime: number | null
  setLastDetectionTime: (time: number | null) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Détections
      detections: [],
      addDetection: (detection) => {
        const newDetection: Detection = {
          ...detection,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }
        set((state) => ({
          detections: [newDetection, ...state.detections].slice(0, 1000), // Limiter à 1000 détections
        }))
        get().updateStats()
      },
      clearDetections: () => {
        set({ detections: [] })
        get().updateStats()
      },
      
      // Statistiques
      stats: {
        totalDetections: 0,
        tshirtCount: 0,
        otherCount: 0,
        averageConfidence: 0,
      },
      updateStats: () => {
        const { detections } = get()
        const totalDetections = detections.length
        const tshirtCount = detections.filter(d => 
          d.clothing.toLowerCase().includes('t-shirt') || 
          d.clothing.toLowerCase().includes('tshirt')
        ).length
        const otherCount = totalDetections - tshirtCount
        const averageConfidence = totalDetections > 0 
          ? detections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections
          : 0
          
        set({
          stats: {
            totalDetections,
            tshirtCount,
            otherCount,
            averageConfidence,
          }
        })
      },
      
      // Paramètres
      settings: {
        confidenceThreshold: 0.5,
        detectionInterval: 1000,
        saveImages: false,
        notifications: true,
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },
      
      // État de l'application
      isDetecting: false,
      setIsDetecting: (detecting) => set({ isDetecting: detecting }),
      
      currentClothing: null,
      setCurrentClothing: (clothing) => set({ currentClothing: clothing }),
      
      lastDetectionTime: null,
      setLastDetectionTime: (time) => set({ lastDetectionTime: time }),
    }),
    {
      name: 'tshirt-detector-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        detections: state.detections,
        settings: state.settings,
        stats: state.stats,
      }),
    }
  )
)