import { useMemo } from 'react'
import { Calendar, TrendingUp, Clock, Percent, Download, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'

const Statistics = () => {
  const { detections, stats, clearDetections } = useStore()

  // Statistiques avancées
  const advancedStats = useMemo(() => {
    if (detections.length === 0) {
      return {
        mostActiveHour: 'N/A',
        mostActiveDay: 'N/A',
        tshirtPercentage: 0,
        averageSessionLength: 0,
        detectionsToday: 0,
        detectionsThisWeek: 0,
        longestStreak: 0,
        favoriteClothing: 'N/A',
      }
    }

    // Heure la plus active
    const hourCounts: { [key: number]: number } = {}
    detections.forEach(d => {
      const hour = new Date(d.timestamp).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '0'

    // Jour le plus actif
    const dayCounts: { [key: string]: number } = {}
    detections.forEach(d => {
      const day = new Date(d.timestamp).toLocaleDateString('fr-FR', { weekday: 'long' })
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })
    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

    // Pourcentage de t-shirts
    const tshirtPercentage = stats.totalDetections > 0 
      ? (stats.clothing.tshirtCount / stats.totalDetections) * 100 
      : 0

    // Détections aujourd'hui
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const detectionsToday = detections.filter(d => 
      new Date(d.timestamp) >= today
    ).length

    // Détections cette semaine
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const detectionsThisWeek = detections.filter(d => 
      new Date(d.timestamp) >= weekStart
    ).length

    // Plus longue série de t-shirts
    let longestStreak = 0
    let currentStreak = 0
    detections.forEach(d => {
      if (d.clothing.toLowerCase().includes('t-shirt')) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })

    // Vêtement favori
    const clothingCounts: { [key: string]: number } = {}
    detections.forEach(d => {
      clothingCounts[d.clothing] = (clothingCounts[d.clothing] || 0) + 1
    })
    const favoriteClothing = Object.entries(clothingCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

    return {
      mostActiveHour: `${mostActiveHour}h`,
      mostActiveDay,
      tshirtPercentage,
      detectionsToday,
      detectionsThisWeek,
      longestStreak,
      favoriteClothing,
    }
  }, [detections, stats])

  // Exporter les données
  const exportData = () => {
    const dataStr = JSON.stringify(detections, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `tshirt-detections-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleClearData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les détections ?')) {
      clearDetections()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistiques Détaillées
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyse approfondie de vos habitudes vestimentaires
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={exportData}
          className="btn-secondary flex items-center gap-2"
          disabled={detections.length === 0}
        >
          <Download size={16} />
          Exporter les données
        </button>
        <button
          onClick={handleClearData}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          disabled={detections.length === 0}
        >
          <Trash2 size={16} />
          Effacer les données
        </button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {advancedStats.detectionsToday}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cette semaine</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {advancedStats.detectionsThisWeek}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Percent className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">% T-shirts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(advancedStats.tshirtPercentage)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Série record</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {advancedStats.longestStreak}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Habitudes temporelles
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Heure la plus active</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {advancedStats.mostActiveHour}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Jour le plus actif</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {advancedStats.mostActiveDay}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Vêtement favori</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {advancedStats.favoriteClothing}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performances du système
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Confiance moyenne</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.round(stats.averageConfidence * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total détections</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.totalDetections}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Taux de succès</span>
              <span className="font-semibold text-green-600">
                {stats.totalDetections > 0 ? '100%' : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition par confiance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Répartition par niveau de confiance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Faible (< 60%)', min: 0, max: 0.6, color: 'bg-red-500' },
            { label: 'Moyenne (60-80%)', min: 0.6, max: 0.8, color: 'bg-yellow-500' },
            { label: 'Élevée (> 80%)', min: 0.8, max: 1, color: 'bg-green-500' },
          ].map((range) => {
            const count = detections.filter(d => 
              d.confidence >= range.min && d.confidence < range.max
            ).length
            const percentage = stats.totalDetections > 0 
              ? (count / stats.totalDetections) * 100 
              : 0

            return (
              <div key={range.label} className="text-center">
                <div className={`w-16 h-16 ${range.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{count}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{range.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(percentage)}% des détections
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historique complet */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Historique complet ({detections.length} détections)
        </h3>
        <div className="max-h-96 overflow-y-auto">
          {detections.length > 0 ? (
            <div className="space-y-2">
              {detections.map((detection, index) => (
                <div 
                  key={detection.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                      #{detections.length - index}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      detection.clothing.toLowerCase().includes('t-shirt')
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {detection.clothing}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(detection.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(detection.confidence * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucune donnée à afficher
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Commencez à utiliser le détecteur pour voir les statistiques
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Statistics