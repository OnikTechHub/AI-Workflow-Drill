import React from 'react'
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Sidebar() {
  const { settings, activeTab, setActiveTab } = useSettings()

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: User,
      badge: null
    },
    {
      id: 'security',
      label: 'Security & 2FA',
      icon: Shield,
      badge: settings.security.twoFactorEnabled ? (
        <span className="nav-badge-pill success">Active</span>
      ) : (
        <span className="nav-badge-pill warning">Review</span>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: null
    },
    {
      id: 'appearance',
      label: 'Appearance & Themes',
      icon: Palette,
      badge: <span className="nav-badge-pill neutral">{settings.appearance.theme}</span>
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      icon: Lock,
      badge: null
    }
  ]

  // Calculate simulated security score
  let securityScore = 50
  if (settings.security.twoFactorEnabled) securityScore += 30
  if (settings.security.loginAlerts) securityScore += 10
  if (!settings.security.requirePasswordExpiry) securityScore += 10

  return (
    <aside className="settings-sidebar">
      <div className="sidebar-sticky-wrap">
        <nav className="sidebar-card">
          <ul className="sidebar-nav-list">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    id={`sidebar-tab-${tab.id}`}
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="nav-item-left">
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-user-summary">
          <div className="summary-header">
            <div className="summary-avatar-wrap">
              <img
                src={settings.profile.avatar}
                alt={settings.profile.displayName}
                className="summary-avatar"
              />
              <span className="summary-status-dot" title="Online & Active" />
            </div>
            <div>
              <div className="summary-title">{settings.profile.displayName}</div>
              <div className="summary-handle">@{settings.profile.username}</div>
            </div>
          </div>

          <div className="security-meter">
            <div className="meter-header">
              <span>Account Security</span>
              <span>{securityScore}%</span>
            </div>
            <div className="meter-bar-track">
              <div
                className="meter-bar-fill"
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
