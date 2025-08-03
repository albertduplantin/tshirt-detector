import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Detection {
  id: string
  timestamp: number
  clothing: string
  glasses: string
  hairType: string
  hairColor: string
  accessories: string[]
  facialHair: string
  age: string
  gender: string
  confidence: number
  details: {
    clothingConfidence: number
    glassesConfidence: number
    hairConfidence: number
    accessoriesConfidence: number
  }
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
    clothing: {
      tshirtCount: number
      shirtCount: number
      sweaterCount: number
      jacketCount: number
      otherCount: number
    }
    glasses: {
      withGlasses: number
      withSunglasses: number
      withoutGlasses: number
    }
    hair: {
      blond: number
      brown: number
      black: number
      red: number
      gray: number
      other: number
    }
    accessories: {
      [key: string]: number
    }
    demographics: {
      young: number
      adult: number
      older: number
      male: number
      female: number
      undetermined: number
    }
    averageConfidence: number
  }
  updateStats: () => void
  
  // Paramètres
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  
  // État de l'application
  isDetecting: boolean
  setIsDetecting: (detecting: boolean) => void
  
  currentDetection: {
    clothing: string | null
    glasses: string | null
    hairType: string | null
    hairColor: string | null
    accessories: string[]
    facialHair: string | null
    age: string | null
    gender: string | null
  }
  setCurrentDetection: (detection: Partial<{
    clothing: string | null
    glasses: string | null
    hairType: string | null
    hairColor: string | null
    accessories: string[]
    facialHair: string | null
    age: string | null
    gender: string | null
  }>) => void
  
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
        clothing: {
          tshirtCount: 0,
          shirtCount: 0,
          sweaterCount: 0,
          jacketCount: 0,
          otherCount: 0,
        },
        glasses: {
          withGlasses: 0,
          withSunglasses: 0,
          withoutGlasses: 0,
        },
        hair: {
          blond: 0,
          brown: 0,
          black: 0,
          red: 0,
          gray: 0,
          other: 0,
        },
        accessories: {},
        demographics: {
          young: 0,
          adult: 0,
          older: 0,
          male: 0,
          female: 0,
          undetermined: 0,
        },
        averageConfidence: 0,
      },
      updateStats: () => {
        const { detections } = get()
        const totalDetections = detections.length
        
        // Initialiser les compteurs
        const stats = {
          totalDetections,
          clothing: {
            tshirtCount: 0,
            shirtCount: 0,
            sweaterCount: 0,
            jacketCount: 0,
            otherCount: 0,
          },
          glasses: {
            withGlasses: 0,
            withSunglasses: 0,
            withoutGlasses: 0,
          },
          hair: {
            blond: 0,
            brown: 0,
            black: 0,
            red: 0,
            gray: 0,
            other: 0,
          },
          accessories: {} as { [key: string]: number },
          demographics: {
            young: 0,
            adult: 0,
            older: 0,
            male: 0,
            female: 0,
            undetermined: 0,
          },
          averageConfidence: 0,
        }

        // Analyser chaque détection
        detections.forEach(detection => {
          // Vêtements
          const clothing = detection.clothing.toLowerCase()
          if (clothing.includes('t-shirt') || clothing.includes('tshirt')) {
            stats.clothing.tshirtCount++
          } else if (clothing.includes('chemise') || clothing.includes('shirt')) {
            stats.clothing.shirtCount++
          } else if (clothing.includes('pull') || clothing.includes('sweat')) {
            stats.clothing.sweaterCount++
          } else if (clothing.includes('veste') || clothing.includes('manteau') || clothing.includes('jacket')) {
            stats.clothing.jacketCount++
          } else {
            stats.clothing.otherCount++
          }

          // Lunettes
          const glasses = detection.glasses.toLowerCase()
          if (glasses.includes('lunettes de vue') || glasses.includes('vue')) {
            stats.glasses.withGlasses++
          } else if (glasses.includes('lunettes de soleil') || glasses.includes('soleil')) {
            stats.glasses.withSunglasses++
          } else {
            stats.glasses.withoutGlasses++
          }

          // Cheveux
          const hairColor = detection.hairColor.toLowerCase()
          if (hairColor.includes('blond')) {
            stats.hair.blond++
          } else if (hairColor.includes('brun') || hairColor.includes('châtain') || hairColor.includes('noir')) {
            stats.hair.brown++
          } else if (hairColor.includes('roux')) {
            stats.hair.red++
          } else if (hairColor.includes('gris') || hairColor.includes('blanc')) {
            stats.hair.gray++
          } else {
            stats.hair.other++
          }

          // Accessoires
          detection.accessories.forEach(accessory => {
            stats.accessories[accessory] = (stats.accessories[accessory] || 0) + 1
          })

          // Démographie
          const age = detection.age.toLowerCase()
          if (age.includes('jeune')) {
            stats.demographics.young++
          } else if (age.includes('âgé') || age.includes('age')) {
            stats.demographics.older++
          } else {
            stats.demographics.adult++
          }

          const gender = detection.gender.toLowerCase()
          if (gender.includes('masculin') || gender.includes('homme')) {
            stats.demographics.male++
          } else if (gender.includes('féminin') || gender.includes('femme')) {
            stats.demographics.female++
          } else {
            stats.demographics.undetermined++
          }
        })

        // Confiance moyenne
        stats.averageConfidence = totalDetections > 0 
          ? detections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections
          : 0
          
        set({ stats })
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
      
      currentDetection: {
        clothing: null,
        glasses: null,
        hairType: null,
        hairColor: null,
        accessories: [],
        facialHair: null,
        age: null,
        gender: null,
      },
      setCurrentDetection: (detection) => set((state) => ({
        currentDetection: { ...state.currentDetection, ...detection }
      })),
      
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
        currentDetection: state.currentDetection,
      }),
    }
  )
)