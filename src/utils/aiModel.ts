import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

let model: cocoSsd.ObjectDetection | null = null

export interface DetectionResult {
  clothing: string
  confidence: number
}

// Mapping des classes COCO vers des vêtements (pour référence future)
// const clothingClasses = {
//   'person': 'Personne détectée',
// }

// Mapping basé sur les couleurs et formes pour détecter les t-shirts
const detectTshirtFromPerson = (canvas: HTMLCanvasElement): DetectionResult | null => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Analyser la zone du torse (approximativement le centre-haut de l'image)
  const startX = Math.floor(canvas.width * 0.3)
  const endX = Math.floor(canvas.width * 0.7)
  const startY = Math.floor(canvas.height * 0.2)
  const endY = Math.floor(canvas.height * 0.6)

  let totalPixels = 0
  let colorVariance = 0
  let averageR = 0, averageG = 0, averageB = 0

  // Analyser les pixels dans la zone du torse
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = (y * canvas.width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      averageR += r
      averageG += g
      averageB += b
      totalPixels++
    }
  }

  if (totalPixels === 0) return null

  averageR /= totalPixels
  averageG /= totalPixels
  averageB /= totalPixels

  // Calculer la variance des couleurs pour détecter des motifs uniformes (typique des t-shirts)
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = (y * canvas.width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      const variance = Math.pow(r - averageR, 2) + Math.pow(g - averageG, 2) + Math.pow(b - averageB, 2)
      colorVariance += variance
    }
  }

  colorVariance /= totalPixels

  // Déterminer le type de vêtement basé sur l'analyse
  let clothing = 'Autre vêtement'
  let confidence = 0.6

  // T-shirt : couleur relativement uniforme, variance faible
  if (colorVariance < 2000) {
    clothing = 'T-shirt'
    confidence = Math.min(0.9, 0.6 + (2000 - colorVariance) / 2000 * 0.3)
  }
  // Chemise : variance moyenne (motifs, rayures)
  else if (colorVariance < 5000) {
    clothing = 'Chemise'
    confidence = Math.min(0.85, 0.5 + (5000 - colorVariance) / 3000 * 0.35)
  }
  // Pull/Sweat : variance élevée (texture)
  else if (colorVariance < 8000) {
    clothing = 'Pull/Sweat'
    confidence = Math.min(0.8, 0.4 + (8000 - colorVariance) / 3000 * 0.4)
  }
  // Veste : variance très élevée
  else {
    clothing = 'Veste/Manteau'
    confidence = Math.min(0.75, 0.3 + Math.min(colorVariance / 10000, 1) * 0.45)
  }

  // Ajuster la confiance basée sur la luminosité (éviter les détections dans l'obscurité)
  const brightness = (averageR + averageG + averageB) / 3
  if (brightness < 50) {
    confidence *= 0.5 // Réduire la confiance dans l'obscurité
  }

  return {
    clothing,
    confidence: Math.max(0.1, confidence)
  }
}

export const loadModel = async (): Promise<void> => {
  try {
    // Configurer TensorFlow.js pour de meilleures performances
    await tf.ready()
    
    // Charger le modèle COCO-SSD
    model = await cocoSsd.load({
      base: 'mobilenet_v2' // Plus rapide que 'lite_mobilenet_v2'
    })
    
    console.log('Modèle IA chargé avec succès')
  } catch (error) {
    console.error('Erreur lors du chargement du modèle:', error)
    throw error
  }
}

export const detectClothing = async (canvas: HTMLCanvasElement): Promise<DetectionResult | null> => {
  if (!model) {
    throw new Error('Modèle non chargé')
  }

  try {
    // Détecter les objets avec COCO-SSD
    const predictions = await model.detect(canvas)
    
    // Chercher une personne dans les prédictions
    const person = predictions.find(p => p.class === 'person' && p.score > 0.5)
    
    if (person) {
      // Si une personne est détectée, analyser ses vêtements
      const clothingResult = detectTshirtFromPerson(canvas)
      if (clothingResult) {
        // Combiner la confiance de détection de personne avec celle du vêtement
        const combinedConfidence = (person.score + clothingResult.confidence) / 2
        return {
          clothing: clothingResult.clothing,
          confidence: combinedConfidence
        }
      }
    }

    // Fallback : analyser directement l'image sans détection de personne
    return detectTshirtFromPerson(canvas)
  } catch (error) {
    console.error('Erreur lors de la détection:', error)
    return null
  }
}

// Fonction utilitaire pour précharger le modèle
export const preloadModel = async (): Promise<void> => {
  if (!model) {
    await loadModel()
  }
}