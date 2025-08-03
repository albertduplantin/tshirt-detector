import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Vérifier le support des APIs nécessaires
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('WebRTC non supporté par ce navigateur');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)