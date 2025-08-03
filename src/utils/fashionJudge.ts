import { DetectionResult } from './aiModel'

export interface FashionJudgment {
  overallScore: number // 0-100
  category: 'Trendy' | 'Classic' | 'Creative' | 'Professional' | 'Casual'
  judgment: string
  compliments: string[]
  suggestions: string[]
  trendScore: {
    colors: number
    style: number
    accessories: number
    overall: number
  }
  funFacts: string[]
  emoji: string
}

export type JudgeMode = 'trends2024' | 'professional' | 'creative' | 'colors' | 'free'

// Base de données des tendances 2024 (utilisée pour les évaluations)
const TRENDS_2024 = {
  colors: {
    hot: ['vert olive', 'beige', 'terracotta', 'lavande', 'sage'],
    classic: ['noir', 'blanc', 'gris', 'marine'],
    vintage: ['rouille', 'moutarde', 'bordeaux', 'camel']
  },
  styles: {
    trending: ['oversized', 'layering', 'minimaliste', 'streetwear', 'cottagecore'],
    timeless: ['classique', 'élégant', 'intemporel'],
    creative: ['mix & match', 'vintage', 'coloré', 'original']
  },
  accessories: {
    trendy: ['lunettes rondes', 'boucles d\'oreilles', 'collier délicat', 'montre'],
    classic: ['lunettes', 'bijoux discrets'],
    statement: ['gros bijoux', 'accessoires colorés']
  }
}

// Fonction utilitaire pour vérifier les tendances
export function isTrendy(item: string, category: 'colors' | 'styles' | 'accessories'): boolean {
  const itemLower = item.toLowerCase()
  return Object.values(TRENDS_2024[category]).some(arr => 
    arr.some(trend => itemLower.includes(trend.toLowerCase()))
  )
}

// Commentaires amusants par score
const JUDGE_COMMENTS = {
  excellent: [
    "🔥 Absolument ICONIC ! Tu pourrais défiler à la Fashion Week !",
    "✨ Look de légende ! Les influenceurs prennent des notes !",
    "👑 Royalty vibes ! Tu redéfinis les codes de la mode !",
    "🎯 Perfection atteinte ! Ce look va faire sensation !",
    "🌟 Tu es une inspiration mode vivante ! Bravo !"
  ],
  great: [
    "💫 Super stylé ! Tu maîtrises les tendances comme un pro !",
    "🎨 Très réussi ! Ton sens du style fait des envieux !",
    "👏 Excellent choix ! Tu as l'œil pour les bonnes associations !",
    "🔥 Look au top ! Tu pourrais être dans un magazine !",
    "⭐ Très moderne ! Tu suis parfaitement les tendances !"
  ],
  good: [
    "👍 Sympa ! Quelques ajustements et ce sera parfait !",
    "😊 Joli look ! Tu as de bonnes bases de style !",
    "💡 Pas mal ! Avec un petit plus, tu seras au top !",
    "🌈 Agréable ! Ton style a du potentiel !",
    "✨ Correct ! Continue à expérimenter !"
  ],
  okay: [
    "🤔 Hmm... On peut faire mieux ! Ose plus !",
    "💭 Basique mais correct. Et si tu ajoutais ta touche perso ?",
    "🎭 Safe mais prévisible. Libère ta créativité !",
    "📚 Look d'étudiant classique. Prêt pour plus d'audace ?",
    "🔄 Neutre. Que dirais-tu d'un peu de pep's ?"
  ],
  needs_work: [
    "😅 Oups ! Même les plus grands stylistes ont leurs ratés !",
    "🎪 Très... original ! L'art, c'est subjectif après tout !",
    "🌈 Audacieux ! Parfois il faut oser pour innover !",
    "🎨 Créatif ! Bon, peut-être un peu trop... 😉",
    "🤪 Unique ! Tu ne passes pas inaperçu, c'est sûr !"
  ]
}

const COMPLIMENTS = [
  "Tes couleurs s'harmonisent parfaitement !",
  "Ce style te va comme un gant !",
  "Excellent choix d'accessoires !",
  "Tu maîtrises l'art du layering !",
  "Tes proportions sont équilibrées !",
  "Belle cohérence dans ton look !",
  "Tu oses et ça paye !",
  "Très photogénique !",
  "Look confortable et stylé !",
  "Tu as trouvé ton style signature !"
]

const SUGGESTIONS = [
  "Essaie d'ajouter une couleur d'accent !",
  "Un accessoire pourrait sublimer le tout !",
  "Que dirais-tu d'un peu plus de contraste ?",
  "Ose mélanger les textures !",
  "Un détail coloré ferait la différence !",
  "Expérimente avec les proportions !",
  "Ajoute une touche personnelle !",
  "Joue avec les superpositions !",
  "Un accessoire statement serait parfait !",
  "Libère ta créativité !"
]

const FUN_FACTS = [
  "💡 Le vert olive est LA couleur tendance de 2024 !",
  "🎨 Les couleurs complémentaires créent le plus d'impact visuel !",
  "👔 Le 'dopamine dressing' (s'habiller pour être heureux) est très en vogue !",
  "✨ Les accessoires représentent 70% de l'impression générale !",
  "🔄 Le style 'mix & match' permet 100+ combinaisons avec 10 pièces !",
  "🌈 Porter du rouge augmente la confiance en soi de 15% !",
  "👗 Le minimalisme reste indémodable depuis 50 ans !",
  "🎭 Changer de style peut booster la créativité !",
  "💫 Les motifs géométriques stimulent l'attention !",
  "🎪 L'originalité en mode = mémorabilité x10 !"
]

// Analyser les couleurs dominantes
function analyzeColors(detection: DetectionResult): { dominant: string[], harmony: number } {
  // Simulation d'analyse de couleurs (à améliorer avec vraie détection)
  const clothing = detection.clothing.toLowerCase()
  const hair = detection.hairColor.toLowerCase()
  
  const colors: string[] = []
  
  // Mapping basique des vêtements vers couleurs probables
  if (clothing.includes('noir') || clothing.includes('sombre')) colors.push('noir')
  else if (clothing.includes('blanc') || clothing.includes('clair')) colors.push('blanc')
  else if (clothing.includes('bleu')) colors.push('bleu')
  else if (clothing.includes('rouge')) colors.push('rouge')
  else if (clothing.includes('vert')) colors.push('vert')
  else colors.push('neutre')
  
  // Ajouter couleur des cheveux
  if (hair.includes('blond')) colors.push('blond')
  else if (hair.includes('brun') || hair.includes('noir')) colors.push('brun')
  else if (hair.includes('roux')) colors.push('roux')
  
  // Score d'harmonie basique
  const harmony = colors.length <= 3 ? 0.8 : 0.6 // Moins de couleurs = plus harmonieux
  
  return { dominant: colors, harmony }
}

// Évaluer selon les tendances 2024
function evaluateTrends2024(detection: DetectionResult): number {
  let score = 50 // Base
  
  const clothing = detection.clothing.toLowerCase()
  const accessories = detection.accessories.map(a => a.toLowerCase())
  const glasses = detection.glasses.toLowerCase()
  
  // Bonus style tendance
  if (clothing.includes('pull') || clothing.includes('sweat')) score += 15 // Oversized trend
  if (clothing.includes('t-shirt')) score += 10 // Casual chic
  
  // Bonus accessoires tendance
  if (glasses.includes('lunettes rondes')) score += 20 // Très tendance
  if (glasses.includes('lunettes')) score += 10
  if (accessories.some(a => a.includes('boucles'))) score += 15
  if (accessories.some(a => a.includes('collier'))) score += 10
  
  // Bonus cheveux
  if (detection.hairColor.toLowerCase().includes('blond')) score += 5 // Toujours classique
  
  return Math.min(100, Math.max(0, score))
}

// Évaluer le look professionnel
function evaluateProfessional(detection: DetectionResult): number {
  let score = 50
  
  const clothing = detection.clothing.toLowerCase()
  const glasses = detection.glasses.toLowerCase()
  
  // Bonus vêtements pro
  if (clothing.includes('chemise')) score += 25
  if (clothing.includes('veste') || clothing.includes('manteau')) score += 20
  if (clothing.includes('pull')) score += 15
  if (clothing.includes('t-shirt')) score -= 10 // Moins formel
  
  // Bonus accessoires pro
  if (glasses.includes('lunettes')) score += 15 // Look intellectuel
  if (detection.facialHair === 'Rasé') score += 10 // Look soigné
  
  return Math.min(100, Math.max(0, score))
}

// Évaluer la créativité
function evaluateCreativity(detection: DetectionResult): number {
  let score = 50
  
  // Plus d'accessoires = plus créatif
  score += detection.accessories.length * 15
  
  // Couleurs de cheveux originales
  if (detection.hairColor.toLowerCase().includes('roux')) score += 20
  if (detection.hairColor.toLowerCase().includes('gris')) score += 15
  
  // Styles de cheveux créatifs
  if (detection.hairType.includes('bouclés')) score += 10
  if (detection.hairType.includes('ondulés')) score += 5
  
  return Math.min(100, Math.max(0, score))
}

// Fonction principale d'évaluation
export function judgeFashion(detection: DetectionResult, mode: JudgeMode = 'free'): FashionJudgment {
  let overallScore = 50
  let category: FashionJudgment['category'] = 'Casual'
  
  // Calcul du score selon le mode
  switch (mode) {
    case 'trends2024':
      overallScore = evaluateTrends2024(detection)
      category = overallScore >= 80 ? 'Trendy' : overallScore >= 60 ? 'Creative' : 'Casual'
      break
    case 'professional':
      overallScore = evaluateProfessional(detection)
      category = overallScore >= 70 ? 'Professional' : 'Classic'
      break
    case 'creative':
      overallScore = evaluateCreativity(detection)
      category = overallScore >= 70 ? 'Creative' : 'Casual'
      break
    case 'colors':
      const { harmony } = analyzeColors(detection)
      overallScore = Math.round(harmony * 100)
      category = overallScore >= 80 ? 'Classic' : 'Casual'
      break
    case 'free':
    default:
      // Évaluation générale
      overallScore = Math.round((
        evaluateTrends2024(detection) * 0.4 +
        evaluateProfessional(detection) * 0.3 +
        evaluateCreativity(detection) * 0.3
      ))
      if (overallScore >= 85) category = 'Trendy'
      else if (overallScore >= 70) category = 'Creative'
      else if (overallScore >= 55) category = 'Classic'
      else category = 'Casual'
      break
  }
  
  // Sélectionner commentaires selon le score
  let commentArray = JUDGE_COMMENTS.okay
  if (overallScore >= 90) commentArray = JUDGE_COMMENTS.excellent
  else if (overallScore >= 75) commentArray = JUDGE_COMMENTS.great
  else if (overallScore >= 60) commentArray = JUDGE_COMMENTS.good
  else if (overallScore >= 40) commentArray = JUDGE_COMMENTS.okay
  else commentArray = JUDGE_COMMENTS.needs_work
  
  const judgment = commentArray[Math.floor(Math.random() * commentArray.length)]
  
  // Sélectionner compliments et suggestions aléatoires
  const compliments = [
    COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)],
    COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]
  ].filter((v, i, a) => a.indexOf(v) === i) // Éviter les doublons
  
  const suggestions = [
    SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)],
    SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]
  ].filter((v, i, a) => a.indexOf(v) === i)
  
  const funFacts = [
    FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]
  ]
  
  // Emoji selon le score
  let emoji = '😊'
  if (overallScore >= 90) emoji = '🔥'
  else if (overallScore >= 75) emoji = '✨'
  else if (overallScore >= 60) emoji = '👍'
  else if (overallScore >= 40) emoji = '🤔'
  else emoji = '😅'
  
  return {
    overallScore,
    category,
    judgment,
    compliments,
    suggestions,
    trendScore: {
      colors: Math.round(analyzeColors(detection).harmony * 100),
      style: evaluateTrends2024(detection),
      accessories: Math.min(100, detection.accessories.length * 25),
      overall: overallScore
    },
    funFacts,
    emoji
  }
}

// Obtenir une évaluation textuelle détaillée
export function getDetailedJudgment(detection: DetectionResult, mode: JudgeMode): string {
  const judgment = judgeFashion(detection, mode)
  
  return `
🎭 VERDICT DU FASHION JUDGE IA ${judgment.emoji}

📊 SCORE GLOBAL : ${judgment.overallScore}/100
🏷️ CATÉGORIE : ${judgment.category}

${judgment.judgment}

✨ CE QUI MARCHE :
${judgment.compliments.map(c => `• ${c}`).join('\n')}

💡 SUGGESTIONS D'AMÉLIORATION :
${judgment.suggestions.map(s => `• ${s}`).join('\n')}

📈 DÉTAIL DES SCORES :
• Style tendance : ${judgment.trendScore.style}/100
• Harmonie couleurs : ${judgment.trendScore.colors}/100  
• Accessoires : ${judgment.trendScore.accessories}/100

${judgment.funFacts[0]}
  `.trim()
}