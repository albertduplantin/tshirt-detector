import { useState, useEffect } from 'react'
import { Menu, X, Camera, BarChart3, Settings, Moon, Sun } from 'lucide-react'
import { useStore } from './store/useStore'
import WebcamDetector from './components/WebcamDetector'
import Dashboard from './components/Dashboard'
import Statistics from './components/Statistics'
import SettingsPanel from './components/SettingsPanel'

function App() {
  const [currentView, setCurrentView] = useState<'detector' | 'dashboard' | 'stats' | 'settings'>('detector')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const menuItems = [
    { id: 'detector', label: 'Détecteur', icon: Camera },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  const renderCurrentView = () => {
    switch (currentView) {
      case 'detector':
        return <WebcamDetector />
      case 'dashboard':
        return <Dashboard />
      case 'stats':
        return <Statistics />
      case 'settings':
        return <SettingsPanel />
      default:
        return <WebcamDetector />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Mobile */}
      <header className="lg:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            T-Shirt Detector
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="p-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as any)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              T-Shirt Detector
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Détection intelligente par IA
            </p>
          </div>
          
          <nav className="flex-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-2 ${
                    currentView === item.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              {darkMode ? 'Mode Clair' : 'Mode Sombre'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App