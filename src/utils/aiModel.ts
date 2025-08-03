import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

let model: cocoSsd.ObjectDetection | null = null

export interface DetectionResult {
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
}

// Mapping des classes COCO vers des vêtements (pour référence future)
// const clothingClasses = {
//   'person': 'Personne détectée',
// }

// Analyse complète d'une personne : vêtements, cheveux, lunettes, accessoires
const analyzePersonCompletely = (canvas: HTMLCanvasElement, personBox?: number[]): DetectionResult | null => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Définir les zones d'analyse basées sur la détection de personne ou par défaut
  let faceArea, torsoArea, hairArea
  
  if (personBox) {
    const [x, y, width, height] = personBox
    faceArea = {
      startX: Math.floor(x + width * 0.2),
      endX: Math.floor(x + width * 0.8),
      startY: Math.floor(y),
      endY: Math.floor(y + height * 0.3)
    }
    torsoArea = {
      startX: Math.floor(x + width * 0.1),
      endX: Math.floor(x + width * 0.9),
      startY: Math.floor(y + height * 0.25),
      endY: Math.floor(y + height * 0.7)
    }
    hairArea = {
      startX: Math.floor(x + width * 0.15),
      endX: Math.floor(x + width * 0.85),
      startY: Math.floor(y),
      endY: Math.floor(y + height * 0.25)
    }
  } else {
    // Zones par défaut si pas de détection de personne
    faceArea = {
      startX: Math.floor(canvas.width * 0.3),
      endX: Math.floor(canvas.width * 0.7),
      startY: Math.floor(canvas.height * 0.1),
      endY: Math.floor(canvas.height * 0.4)
    }
    torsoArea = {
      startX: Math.floor(canvas.width * 0.25),
      endX: Math.floor(canvas.width * 0.75),
      startY: Math.floor(canvas.height * 0.3),
      endY: Math.floor(canvas.height * 0.7)
    }
    hairArea = {
      startX: Math.floor(canvas.width * 0.3),
      endX: Math.floor(canvas.width * 0.7),
      startY: Math.floor(canvas.height * 0.05),
      endY: Math.floor(canvas.height * 0.3)
    }
  }

  // 1. ANALYSE DES VÊTEMENTS (zone torse)
  const clothingAnalysis = analyzeClothing(data, canvas.width, torsoArea)
  
  // 2. ANALYSE DES CHEVEUX (zone cheveux)
  const hairAnalysis = analyzeHair(data, canvas.width, hairArea)
  
  // 3. ANALYSE DES LUNETTES (zone visage)
  const glassesAnalysis = analyzeGlasses(data, canvas.width, faceArea)
  
  // 4. ANALYSE DES ACCESSOIRES (zones multiples)
  const accessoriesAnalysis = analyzeAccessories(data, canvas.width, faceArea, torsoArea)
  
  // 5. ANALYSE FACIALE (barbe, âge, genre)
  const facialAnalysis = analyzeFacialFeatures(data, canvas.width, faceArea)

  // Calcul de la confiance globale
  const globalConfidence = (
    clothingAnalysis.confidence +
    hairAnalysis.confidence +
    glassesAnalysis.confidence +
    accessoriesAnalysis.confidence
  ) / 4

  return {
    clothing: clothingAnalysis.type,
    glasses: glassesAnalysis.type,
    hairType: hairAnalysis.type,
    hairColor: hairAnalysis.color,
    accessories: accessoriesAnalysis.items,
    facialHair: facialAnalysis.facialHair,
    age: facialAnalysis.ageGroup,
    gender: facialAnalysis.gender,
    confidence: globalConfidence,
    details: {
      clothingConfidence: clothingAnalysis.confidence,
      glassesConfidence: glassesAnalysis.confidence,
      hairConfidence: hairAnalysis.confidence,
      accessoriesConfidence: accessoriesAnalysis.confidence
    }
  }
}

// Fonction d'analyse des vêtements
const analyzeClothing = (data: Uint8ClampedArray, width: number, area: any) => {
  let totalPixels = 0
  let colorVariance = 0
  let averageR = 0, averageG = 0, averageB = 0

  // Analyser les pixels dans la zone du torse
  for (let y = area.startY; y < area.endY; y++) {
    for (let x = area.startX; x < area.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      averageR += r
      averageG += g
      averageB += b
      totalPixels++
    }
  }

  if (totalPixels === 0) return { type: 'Non détecté', confidence: 0 }

  averageR /= totalPixels
  averageG /= totalPixels
  averageB /= totalPixels

  // Calculer la variance des couleurs
  for (let y = area.startY; y < area.endY; y++) {
    for (let x = area.startX; x < area.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      const variance = Math.pow(r - averageR, 2) + Math.pow(g - averageG, 2) + Math.pow(b - averageB, 2)
      colorVariance += variance
    }
  }

  colorVariance /= totalPixels

  // Déterminer le type de vêtement
  let type = 'Autre vêtement'
  let confidence = 0.6

  if (colorVariance < 2000) {
    type = 'T-shirt'
    confidence = Math.min(0.9, 0.6 + (2000 - colorVariance) / 2000 * 0.3)
  } else if (colorVariance < 5000) {
    type = 'Chemise'
    confidence = Math.min(0.85, 0.5 + (5000 - colorVariance) / 3000 * 0.35)
  } else if (colorVariance < 8000) {
    type = 'Pull/Sweat'
    confidence = Math.min(0.8, 0.4 + (8000 - colorVariance) / 3000 * 0.4)
  } else {
    type = 'Veste/Manteau'
    confidence = Math.min(0.75, 0.3 + Math.min(colorVariance / 10000, 1) * 0.45)
  }

  // Ajuster selon la luminosité
  const brightness = (averageR + averageG + averageB) / 3
  if (brightness < 50) confidence *= 0.5

  return { type, confidence: Math.max(0.1, confidence) }
}

// Fonction d'analyse des cheveux
const analyzeHair = (data: Uint8ClampedArray, width: number, area: any) => {
  let darkPixels = 0, lightPixels = 0, coloredPixels = 0
  let totalPixels = 0
  let avgR = 0, avgG = 0, avgB = 0
  let textureVariance = 0

  for (let y = area.startY; y < area.endY; y++) {
    for (let x = area.startX; x < area.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      avgR += r
      avgG += g
      avgB += b
      
      const brightness = (r + g + b) / 3
      if (brightness < 80) darkPixels++
      else if (brightness > 180) lightPixels++
      else coloredPixels++
      
      totalPixels++
    }
  }

  if (totalPixels === 0) return { type: 'Non visible', color: 'Non détecté', confidence: 0 }

  avgR /= totalPixels
  avgG /= totalPixels
  avgB /= totalPixels

  // Calculer la texture
  for (let y = area.startY; y < area.endY; y++) {
    for (let x = area.startX; x < area.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      textureVariance += Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2)
    }
  }
  textureVariance /= totalPixels

  // Déterminer le type de cheveux
  let type = 'Cheveux courts'
  if (textureVariance > 3000) type = 'Cheveux bouclés'
  else if (textureVariance < 1000) type = 'Cheveux lisses'
  else type = 'Cheveux ondulés'

  // Déterminer la couleur
  let color = 'Châtain'
  const darkRatio = darkPixels / totalPixels
  const lightRatio = lightPixels / totalPixels

  if (darkRatio > 0.6) color = 'Brun/Noir'
  else if (lightRatio > 0.4) color = 'Blond'
  else if (avgR > avgG && avgR > avgB) color = 'Roux'
  else if (avgR > 150 && avgG > 150 && avgB > 150) color = 'Gris/Blanc'

  const confidence = Math.min(0.8, 0.4 + (Math.max(darkRatio, lightRatio) * 0.4))

  return { type, color, confidence }
}

// Fonction d'analyse des lunettes (améliorée)
const analyzeGlasses = (data: Uint8ClampedArray, width: number, area: any) => {
  let reflectionPixels = 0
  let framePixels = 0
  let totalPixels = 0
  let edgeCount = 0
  let darkFramePixels = 0

  // Zone élargie pour les lunettes (couvre mieux les yeux)
  const glassArea = {
    startX: area.startX + Math.floor((area.endX - area.startX) * 0.05),
    endX: area.endX - Math.floor((area.endX - area.startX) * 0.05),
    startY: area.startY + Math.floor((area.endY - area.startY) * 0.25),
    endY: area.startY + Math.floor((area.endY - area.startY) * 0.75)
  }

  // Zones spécifiques pour les yeux (gauche et droite)
  const eyeAreas = [
    {
      startX: glassArea.startX,
      endX: glassArea.startX + Math.floor((glassArea.endX - glassArea.startX) * 0.45),
      startY: glassArea.startY,
      endY: glassArea.endY
    },
    {
      startX: glassArea.startX + Math.floor((glassArea.endX - glassArea.startX) * 0.55),
      endX: glassArea.endX,
      startY: glassArea.startY,
      endY: glassArea.endY
    }
  ]

  // Analyser les deux zones d'yeux
  eyeAreas.forEach(eyeArea => {
    for (let y = eyeArea.startY; y < eyeArea.endY; y++) {
      for (let x = eyeArea.startX; x < eyeArea.endX; x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        
        const brightness = (r + g + b) / 3
        
        // Détecter les reflets sur verres (plus sensible)
        if (brightness > 180 && Math.abs(r - g) < 40 && Math.abs(g - b) < 40) {
          reflectionPixels++
        }
        
        // Détecter les montures sombres (lunettes noires/foncées)
        if (brightness < 80 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
          darkFramePixels++
        }
        
        // Détecter les contours de montures (plus sensible)
        if (x > eyeArea.startX && y > eyeArea.startY) {
          const prevIndex = ((y-1) * width + (x-1)) * 4
          const prevBrightness = (data[prevIndex] + data[prevIndex + 1] + data[prevIndex + 2]) / 3
          const contrast = Math.abs(brightness - prevBrightness)
          
          if (contrast > 40) {
            edgeCount++
          }
          
          // Détecter les pixels de monture (contraste modéré mais persistant)
          if (contrast > 25 && contrast < 100) {
            framePixels++
          }
        }
        
        totalPixels++
      }
    }
  })

  if (totalPixels === 0) return { type: 'Pas de lunettes', confidence: 0.3 }

  const reflectionRatio = reflectionPixels / totalPixels
  const edgeRatio = edgeCount / totalPixels
  const frameRatio = framePixels / totalPixels
  const darkFrameRatio = darkFramePixels / totalPixels

  let type = 'Pas de lunettes'
  let confidence = 0.3

  // Algorithme amélioré de détection
  const glassesScore = (reflectionRatio * 3) + (edgeRatio * 2) + (frameRatio * 1.5) + (darkFrameRatio * 2)

  if (glassesScore > 0.15) {
    // Détecter le type de lunettes
    if (reflectionRatio > 0.03 || edgeRatio > 0.08) {
      if (darkFrameRatio > 0.05) {
        type = 'Lunettes de soleil'
        confidence = Math.min(0.9, 0.4 + glassesScore * 2)
      } else {
        type = 'Lunettes de vue'
        confidence = Math.min(0.9, 0.5 + glassesScore * 1.5)
      }
    } else if (frameRatio > 0.05 || darkFrameRatio > 0.03) {
      type = 'Lunettes de vue'
      confidence = Math.min(0.85, 0.4 + glassesScore * 1.8)
    }
  } else if (glassesScore > 0.08) {
    // Détection faible mais possible
    type = 'Lunettes de vue'
    confidence = Math.min(0.7, 0.3 + glassesScore * 2)
  }

  // Bonus pour les lunettes rondes (comme sur votre photo)
  if (type !== 'Pas de lunettes') {
    // Vérifier la forme circulaire en analysant la distribution des contours
    let circularityBonus = 0
    const centerX = (glassArea.startX + glassArea.endX) / 2
    const centerY = (glassArea.startY + glassArea.endY) / 2
    
    // Simple vérification de circularité basée sur la distance au centre
    let circularEdges = 0
    for (let y = glassArea.startY; y < glassArea.endY; y += 3) {
      for (let x = glassArea.startX; x < glassArea.endX; x += 3) {
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const maxDistance = Math.min(glassArea.endX - glassArea.startX, glassArea.endY - glassArea.startY) / 2
        
        if (distance > maxDistance * 0.3 && distance < maxDistance * 0.8) {
          const index = (y * width + x) * 4
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3
          
          if (x > glassArea.startX && y > glassArea.startY) {
            const prevIndex = ((y-1) * width + (x-1)) * 4
            const prevBrightness = (data[prevIndex] + data[prevIndex + 1] + data[prevIndex + 2]) / 3
            if (Math.abs(brightness - prevBrightness) > 30) {
              circularEdges++
            }
          }
        }
      }
    }
    
    const circularRatio = circularEdges / (totalPixels / 9) // Divisé par 9 car on échantillonne tous les 3 pixels
    if (circularRatio > 0.02) {
      circularityBonus = Math.min(0.2, circularRatio * 5)
      confidence += circularityBonus
    }
  }

  return { type, confidence: Math.min(0.95, Math.max(0.1, confidence)) }
}

// Fonction d'analyse des accessoires
const analyzeAccessories = (data: Uint8ClampedArray, width: number, faceArea: any, torsoArea: any) => {
  const accessories: string[] = []
  let totalConfidence = 0

  // Analyser la zone du cou pour les colliers/cravates
  const neckArea = {
    startX: faceArea.startX,
    endX: faceArea.endX,
    startY: faceArea.endY,
    endY: torsoArea.startY
  }

  let metallicPixels = 0
  let fabricPixels = 0
  let totalNeckPixels = 0

  for (let y = neckArea.startY; y < neckArea.endY; y++) {
    for (let x = neckArea.startX; x < neckArea.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      const brightness = (r + g + b) / 3
      
      // Détecter des éléments métalliques (reflets)
      if (brightness > 180 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
        metallicPixels++
      }
      
      // Détecter des tissus structurés (cravates)
      if (Math.abs(r - g) > 30 || Math.abs(g - b) > 30) {
        fabricPixels++
      }
      
      totalNeckPixels++
    }
  }

  if (totalNeckPixels > 0) {
    const metallicRatio = metallicPixels / totalNeckPixels
    const fabricRatio = fabricPixels / totalNeckPixels

    if (metallicRatio > 0.02) {
      accessories.push('Collier/Bijou')
      totalConfidence += 0.6 + metallicRatio * 2
    }
    
    if (fabricRatio > 0.3) {
      accessories.push('Cravate/Foulard')
      totalConfidence += 0.5 + fabricRatio
    }
  }

  // Analyser les oreilles pour les boucles d'oreilles
  const earAreas = [
    { startX: faceArea.startX - 20, endX: faceArea.startX + 10, startY: faceArea.startY + 20, endY: faceArea.startY + 60 },
    { startX: faceArea.endX - 10, endX: faceArea.endX + 20, startY: faceArea.startY + 20, endY: faceArea.startY + 60 }
  ]

  earAreas.forEach(earArea => {
    let earMetallicPixels = 0
    let earTotalPixels = 0

    for (let y = Math.max(0, earArea.startY); y < Math.min(width, earArea.endY); y++) {
      for (let x = Math.max(0, earArea.startX); x < Math.min(width, earArea.endX); x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        
        const brightness = (r + g + b) / 3
        
        if (brightness > 190 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) {
          earMetallicPixels++
        }
        
        earTotalPixels++
      }
    }

    if (earTotalPixels > 0 && earMetallicPixels / earTotalPixels > 0.05) {
      if (!accessories.includes('Boucles d\'oreilles')) {
        accessories.push('Boucles d\'oreilles')
        totalConfidence += 0.7
      }
    }
  })

  const avgConfidence = accessories.length > 0 ? totalConfidence / accessories.length : 0.3

  return { items: accessories, confidence: Math.min(0.9, avgConfidence) }
}

// Fonction d'analyse des traits faciaux
const analyzeFacialFeatures = (data: Uint8ClampedArray, width: number, area: any) => {
  // Zone de la barbe/moustache (bas du visage)
  const beardArea = {
    startX: area.startX + Math.floor((area.endX - area.startX) * 0.2),
    endX: area.endX - Math.floor((area.endX - area.startX) * 0.2),
    startY: area.startY + Math.floor((area.endY - area.startY) * 0.6),
    endY: area.endY
  }

  let darkHairPixels = 0
  let totalBeardPixels = 0
  let skinTone = { r: 0, g: 0, b: 0 }
  let skinPixels = 0

  // Analyser la zone de barbe et le teint de peau
  for (let y = beardArea.startY; y < beardArea.endY; y++) {
    for (let x = beardArea.startX; x < beardArea.endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      
      const brightness = (r + g + b) / 3
      
      // Détecter les poils de barbe (pixels sombres dans la zone)
      if (brightness < 100) {
        darkHairPixels++
      } else if (brightness > 120 && brightness < 220) {
        // Pixels de peau probable
        skinTone.r += r
        skinTone.g += g
        skinTone.b += b
        skinPixels++
      }
      
      totalBeardPixels++
    }
  }

  // Déterminer la pilosité faciale
  let facialHair = 'Rasé'
  const beardRatio = darkHairPixels / totalBeardPixels
  
  if (beardRatio > 0.15) facialHair = 'Barbe'
  else if (beardRatio > 0.08) facialHair = 'Barbe de 3 jours'
  else if (beardRatio > 0.04) facialHair = 'Moustache'

  // Estimer l'âge basé sur la texture de peau et autres indices
  let ageGroup = 'Adulte'
  if (skinPixels > 0) {
    skinTone.r /= skinPixels
    skinTone.g /= skinPixels
    skinTone.b /= skinPixels
    
    const skinVariance = Math.abs(skinTone.r - skinTone.g) + Math.abs(skinTone.g - skinTone.b)
    
    if (skinVariance < 20 && (skinTone.r + skinTone.g + skinTone.b) / 3 > 180) {
      ageGroup = 'Jeune'
    } else if (skinVariance > 40 || beardRatio > 0.1) {
      ageGroup = 'Âgé'
    }
  }

  // Estimation approximative du genre (basée sur plusieurs facteurs)
  let gender = 'Non déterminé'
  const hairLength = area.endY - area.startY // Approximation
  
  if (beardRatio > 0.08) {
    gender = 'Masculin'
  } else if (hairLength > 100 && beardRatio < 0.02) {
    gender = 'Féminin'
  }

  return {
    facialHair,
    ageGroup,
    gender
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
      // Si une personne est détectée, faire l'analyse complète avec sa boîte englobante
      const personBox = [person.bbox[0], person.bbox[1], person.bbox[2], person.bbox[3]]
      const analysisResult = analyzePersonCompletely(canvas, personBox)
      
      if (analysisResult) {
        // Combiner la confiance de détection de personne avec l'analyse
        const enhancedConfidence = (person.score + analysisResult.confidence) / 2
        return {
          ...analysisResult,
          confidence: enhancedConfidence
        }
      }
    }

    // Fallback : analyser directement l'image sans détection de personne précise
    return analyzePersonCompletely(canvas)
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