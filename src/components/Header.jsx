import React from 'react'
import {
  Sliders,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  AlertCircle,
  Save,
  CheckCircle2,
  X
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Header() {
  const {
    settings,
    hasUnsavedChanges,
    saveSettings,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useSettings()

  const isDark = settings.appearance.theme === 'dark'

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Sliders size={20} />
          </div>
          <div className="brand-text">
            <h1>Apex Studio</h1>
            <span className="brand-subtitle">Workspace &amp; Account Settings</span>
          </div>
        </div>

        <div className="header-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              id="settings-search-input"
              className="search-input"
              placeholder="Search settings, security, notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                style={{ right: '0.8rem', background: 'none', border: 'none' }}
              >
                <X size={14} />
              </button>
            ) : (
              <span className="search-shortcut">Ctrl+K</span>
            )}
          </div>
        </div>

        <div className="header-actions">
          {hasUnsavedChanges ? (
            <button
              type="button"
              id="header-save-btn"
              className="btn btn-sm btn-primary"
              onClick={saveSettings}
              title="Save pending changes"
            >
              <Save size={14} />
              Save Changes
            </button>
          ) : (
            <div
              className="nav-badge-pill success"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px' }}
            >
              <CheckCircle2 size={13} />
              Saved
            </div>
          )}

          <button
            type="button"
            id="theme-quick-toggle-btn"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme appearance"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div
            className="user-profile-badge"
            onClick={() => setActiveTab('profile')}
            title="Go to Profile settings"
          >
            <img
              src={settings.profile.avatar}
              alt={settings.profile.displayName}
              className="avatar-mini"
            />
            <div className="badge-info">
              <span className="badge-name">{settings.profile.displayName}</span>
              <span className="badge-role">Pro Account</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
