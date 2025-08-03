import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Shirt, Clock, Target } from 'lucide-react'
import { useStore } from '../store/useStore'

const Dashboard = () => {
  const { detections, stats } = useStore()

  // Données pour les graphiques
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      detections: 0,
      tshirts: 0,
    }))

    detections.forEach(detection => {
      const hour = new Date(detection.timestamp).getHours()
      hours[hour].detections++
      if (detection.clothing.toLowerCase().includes('t-shirt')) {
        hours[hour].tshirts++
      }
    })

    return hours.map(h => ({
      ...h,
      hour: `${h.hour}h`
    }))
  }, [detections])

  const clothingDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {}
    
    detections.forEach(detection => {
      const clothing = detection.clothing
      distribution[clothing] = (distribution[clothing] || 0) + 1
    })

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }))
  }, [detections])

  const recentTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        timestamp: date.getTime(),
        tshirts: 0,
        other: 0,
      }
    })

    detections.forEach(detection => {
      const detectionDate = new Date(detection.timestamp)
      const dayIndex = last7Days.findIndex(day => {
        const dayDate = new Date(day.timestamp)
        return dayDate.toDateString() === detectionDate.toDateString()
      })

      if (dayIndex !== -1) {
        if (detection.clothing.toLowerCase().includes('t-shirt')) {
          last7Days[dayIndex].tshirts++
        } else {
          last7Days[dayIndex].other++
        }
      }
    })

    return last7Days
  }, [detections])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Aperçu de vos détections de vêtements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Détections</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalDetections}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <Shirt className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">T-Shirts</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.tshirtCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Autres Vêtements</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.otherCount}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Confiance Moyenne</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(stats.averageConfidence * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Détections par heure */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Détections par heure
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="hour" 
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="detections" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tshirts" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution des vêtements */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Types de vêtements
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clothingDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {clothingDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {clothingDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendance sur 7 jours */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tendance des 7 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recentTrend}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="tshirts" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              name="T-shirts"
            />
            <Line 
              type="monotone" 
              dataKey="other" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              name="Autres"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Détections récentes */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Détections récentes
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {detections.slice(0, 10).map((detection) => (
            <div 
              key={detection.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confiance
                </p>
              </div>
            </div>
          ))}
          
          {detections.length === 0 && (
            <div className="text-center py-8">
              <Shirt size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucune détection pour le moment
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Utilisez le détecteur pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard