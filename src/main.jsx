import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key)
      if (value === null) throw new Error(`Key not found: ${key}`)
      return { key, value }
    },
    set: async (key, value) => {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
      return { key, value }
    },
    delete: async (key) => { localStorage.removeItem(key); return { key, deleted: true } },
    list: async (prefix = '') => ({ keys: Object.keys(localStorage).filter(k => k.startsWith(prefix)) })
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
