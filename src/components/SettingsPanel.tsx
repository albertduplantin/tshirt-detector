import { useState } from 'react'
import { Save, RotateCcw, Bell, Camera, Zap, Shield } from 'lucide-react'
import { useStore } from '../store/useStore'

const SettingsPanel = () => {
  const { settings, updateSettings, clearDetections } = useStore()
  const [tempSettings, setTempSettings] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings(tempSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const defaultSettings = {
      confidenceThreshold: 0.5,
      detectionInterval: 1000,
      saveImages: false,
      notifications: true,
    }
    setTempSettings(defaultSettings)
    updateSettings(defaultSettings)
  }

  const handleClearData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      clearDetections()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paramètres
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configurez l'application selon vos préférences
        </p>
      </div>

      {/* Paramètres de détection */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Zap className="text-blue-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Détection IA
          </h3>
        </div>

        <div className="space-y-6">
          {/* Seuil de confiance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seuil de confiance minimum
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={tempSettings.confidenceThreshold}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  confidenceThreshold: parseFloat(e.target.value)
                })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">
                {Math.round(tempSettings.confidenceThreshold * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Plus la valeur est élevée, plus les détections seront précises mais moins fréquentes
            </p>
          </div>

          {/* Intervalle de détection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Intervalle entre détections
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="500"
                max="5000"
                step="500"
                value={tempSettings.detectionInterval}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  detectionInterval: parseInt(e.target.value)
                })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white w-16">
                {tempSettings.detectionInterval}ms
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Temps minimum entre deux détections enregistrées
            </p>
          </div>
        </div>
      </div>

      {/* Paramètres de l'interface */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <Camera className="text-green-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interface & Données
          </h3>
        </div>

        <div className="space-y-6">
          {/* Sauvegarde d'images */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sauvegarder les images
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enregistrer une capture d'écran avec chaque détection
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.saveImages}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  saveImages: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notifications
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recevoir des alertes pour les détections importantes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.notifications}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  notifications: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Données et sécurité */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
            <Shield className="text-red-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Données et Sécurité
          </h3>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              🔒 Confidentialité
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Toutes vos données sont stockées localement dans votre navigateur. 
              Aucune information n'est envoyée vers des serveurs externes.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              ⚠️ Stockage local
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Les données peuvent être perdues si vous videz le cache de votre navigateur 
              ou désinstallez l'application.
            </p>
          </div>

          <button
            onClick={handleClearData}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Shield size={16} />
            Supprimer toutes les données
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Réinitialiser
        </button>
        
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 ${
            saved ? 'bg-green-500 hover:bg-green-600' : ''
          }`}
        >
          {saved ? (
            <>
              <Bell size={16} />
              Sauvegardé !
            </>
          ) : (
            <>
              <Save size={16} />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {/* Informations sur l'application */}
      <div className="card bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          À propos de l'application
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Version</p>
            <p className="text-gray-600 dark:text-gray-400">1.0.0</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Technologie</p>
            <p className="text-gray-600 dark:text-gray-400">React + TensorFlow.js</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Modèle IA</p>
            <p className="text-gray-600 dark:text-gray-400">COCO-SSD + Analyse d'image</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Créé par</p>
            <p className="text-gray-600 dark:text-gray-400">Assistant IA</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel