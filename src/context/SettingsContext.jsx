import React, { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'apex_user_settings_v1'

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
]

const DEFAULT_SETTINGS = {
  profile: {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    firstName: 'Onik',
    lastName: 'Das',
    displayName: 'Onik Das',
    username: 'onikdas',
    email: 'onikdas.dev@gmail.com',
    isEmailVerified: true,
    role: 'Staff AI Systems Architect',
    company: 'Flyrank AI',
    bio: 'Architecting intelligent autonomous agents, multi-agent workflows, and next-gen developer infrastructure. Exploring generative interfaces and neural code synthesis.',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    github: 'https://github.com/OnikTechHub',
    twitter: 'https://x.com/onikdas',
    linkedin: 'https://linkedin.com/in/onikdas',
    website: 'https://onikdas.dev'
  },
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    lastPasswordChange: '42 days ago',
    loginAlerts: true,
    requirePasswordExpiry: false,
    sessionTimeout: '30',
    sessions: [
      {
        id: 's-1',
        device: 'Windows 11 PC · Chrome 134',
        location: 'San Francisco, US',
        ip: '192.0.2.14',
        lastActive: 'Active now',
        isCurrent: true,
        type: 'desktop'
      },
      {
        id: 's-2',
        device: 'MacBook Pro M3 · Safari 17.4',
        location: 'San Francisco, US',
        ip: '192.0.2.89',
        lastActive: '3 hours ago',
        isCurrent: false,
        type: 'laptop'
      },
      {
        id: 's-3',
        device: 'iPhone 15 Pro · iOS App',
        location: 'San Jose, US',
        ip: '198.51.100.22',
        lastActive: 'Yesterday at 8:45 PM',
        isCurrent: false,
        type: 'mobile'
      }
    ]
  },
  notifications: {
    emailDigest: true,
    securityAlerts: true,
    teamMentions: true,
    productUpdates: false,
    browserPush: true,
    smsAlerts: false,
    phoneNumber: '+1 (555) 019-2834',
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    frequency: 'instant'
  },
  appearance: {
    theme: 'dark',
    accent: 'indigo',
    density: 'comfortable',
    fontSize: 15,
    reduceMotion: false,
    showCodeLineNumbers: true
  },
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    searchEngineIndexing: true,
    telemetry: false,
    allowDataSharing: false,
    connectedAccounts: [
      { id: 'google', name: 'Google Workspace', identifier: 'onikdas.dev@gmail.com', connected: true },
      { id: 'github', name: 'GitHub Enterprise', identifier: '@OnikTechHub', connected: true },
      { id: 'slack', name: 'Slack HQ', identifier: 'Not connected', connected: false },
      { id: 'figma', name: 'Figma Teams', identifier: 'Not connected', connected: false }
    ]
  }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load saved settings from localStorage', e)
    }
    return DEFAULT_SETTINGS
  })

  const [savedSettings, setSavedSettings] = useState(settings)
  const [activeTab, setActiveTab] = useState('profile')
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])

  // Check if form has unsaved modifications
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  // Sync theme, accent, and density with DOM root
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', settings.appearance.theme)
    root.setAttribute('data-accent', settings.appearance.accent)
    root.setAttribute('data-density', settings.appearance.density)
    root.style.setProperty('--font-size-base', `${settings.appearance.fontSize}px`)
  }, [settings.appearance])

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateSection = (section, newValues) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newValues
      }
    }))
  }

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSavedSettings(settings)
      addToast('All preferences and account settings saved successfully!', 'success')
      return true
    } catch (e) {
      addToast('Error saving settings to storage.', 'error')
      return false
    }
  }

  const discardChanges = () => {
    setSettings(savedSettings)
    addToast('Unsaved changes discarded.', 'info')
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
    setSavedSettings(DEFAULT_SETTINGS)
    addToast('Restored all settings to default configurations.', 'info')
  }

  const exportSettingsJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `apex-settings-export-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      addToast('Settings data exported as JSON.', 'success')
    } catch (err) {
      addToast('Failed to export data.', 'error')
    }
  }

  // Quick toggle between light & dark
  const toggleTheme = () => {
    const newTheme = settings.appearance.theme === 'dark' ? 'light' : 'dark'
    updateField('appearance', 'theme', newTheme)
    addToast(`Switched to ${newTheme} mode`, 'info')
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        savedSettings,
        hasUnsavedChanges,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        updateField,
        updateSection,
        saveSettings,
        discardChanges,
        resetToDefaults,
        exportSettingsJson,
        toggleTheme,
        presetAvatars: PRESET_AVATARS
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
