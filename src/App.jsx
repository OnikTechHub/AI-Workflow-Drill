import React, { useEffect } from 'react'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProfileTab from './components/tabs/ProfileTab'
import SecurityTab from './components/tabs/SecurityTab'
import NotificationsTab from './components/tabs/NotificationsTab'
import AppearanceTab from './components/tabs/AppearanceTab'
import PrivacyTab from './components/tabs/PrivacyTab'
import FloatingSaveBar from './components/FloatingSaveBar'
import Toast from './components/Toast'
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Search,
  Sparkles
} from 'lucide-react'

function SettingsAppContent() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useSettings()

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('settings-search-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-switch tab based on search query matching keywords
  useEffect(() => {
    if (!searchQuery) return
    const q = searchQuery.toLowerCase()
    if (q.includes('pass') || q.includes('2fa') || q.includes('auth') || q.includes('session') || q.includes('device') || q.includes('danger')) {
      setActiveTab('security')
    } else if (q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('accent') || q.includes('color') || q.includes('font') || q.includes('density')) {
      setActiveTab('appearance')
    } else if (q.includes('notif') || q.includes('alert') || q.includes('push') || q.includes('sms') || q.includes('quiet') || q.includes('digest')) {
      setActiveTab('notifications')
    } else if (q.includes('priv') || q.includes('export') || q.includes('connect') || q.includes('visibility') || q.includes('online')) {
      setActiveTab('privacy')
    } else if (q.includes('avatar') || q.includes('name') || q.includes('bio') || q.includes('photo') || q.includes('social') || q.includes('role')) {
      setActiveTab('profile')
    }
  }, [searchQuery, setActiveTab])

  const mobileTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ]

  return (
    <div className="app-container">
      <Header />

      <main className="main-layout">
        <Sidebar />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile Tab Scroller */}
          <div className="mobile-nav-scroller">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`mobile-tab-${tab.id}`}
                  className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'privacy' && <PrivacyTab />}
        </div>
      </main>

      <FloatingSaveBar />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <SettingsAppContent />
    </SettingsProvider>
  )
}
