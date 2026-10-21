import React, { useState } from 'react'
import {
  Lock,
  Eye,
  EyeOff,
  Globe,
  Download,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  Database
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function PrivacyTab() {
  const {
    settings,
    updateField,
    exportSettingsJson,
    resetToDefaults,
    addToast
  } = useSettings()

  const { privacy } = settings
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  const handleToggleConnection = (accId) => {
    const updated = privacy.connectedAccounts.map((acc) => {
      if (acc.id === accId) {
        const nextState = !acc.connected
        return {
          ...acc,
          connected: nextState,
          identifier: nextState
            ? acc.id === 'slack'
              ? 'Flyrank Team'
              : 'onikdas@design'
            : 'Not connected'
        }
      }
      return acc
    })
    updateField('privacy', 'connectedAccounts', updated)
    const target = updated.find((a) => a.id === accId)
    addToast(`${target.name} ${target.connected ? 'connected' : 'disconnected'}.`, 'info')
  }

  return (
    <div className="settings-content-area">
      <div className="section-header">
        <h2 className="section-title">Privacy &amp; Data Governance</h2>
        <p className="section-desc">
          Manage your online visibility, third-party connected services, and export your personal data archive.
        </p>
      </div>

      {/* Visibility */}
      <section className="settings-card" id="card-visibility">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Eye size={18} /> Profile Visibility &amp; Presence
            </h3>
            <p className="card-subtitle">
              Control who can see your workspace activity and profile details.
            </p>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '420px' }}>
          <label className="form-label" htmlFor="profile-visibility">
            Default Profile Visibility
          </label>
          <select
            id="profile-visibility"
            className="form-select"
            value={privacy.profileVisibility}
            onChange={(e) => updateField('privacy', 'profileVisibility', e.target.value)}
          >
            <option value="public">Public (Visible to anyone with your link)</option>
            <option value="team">Team Only (Members of your organization)</option>
            <option value="private">Private (Only visible to you)</option>
          </select>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Show Active Status</span>
            <span className="toggle-desc">
              Display a green indicator dot to coworkers when you are actively working in the IDE.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-online-status"
              checked={privacy.showOnlineStatus}
              onChange={(e) => updateField('privacy', 'showOnlineStatus', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Search Engine Indexing</span>
            <span className="toggle-desc">
              Allow search engines like Google and Bing to index your public portfolio card.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-search-indexing"
              checked={privacy.searchEngineIndexing}
              onChange={(e) => updateField('privacy', 'searchEngineIndexing', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </section>

      {/* Connected Accounts */}
      <section className="settings-card" id="card-integrations">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Layers size={18} /> Connected Services &amp; OAuth
            </h3>
            <p className="card-subtitle">
              Integrate third-party developer platforms for single sign-on and seamless collaboration.
            </p>
          </div>
        </div>

        <div className="integrations-list">
          {privacy.connectedAccounts.map((acc) => (
            <div key={acc.id} className="integration-item">
              <div className="integration-left">
                <div className="integration-icon">
                  <Globe size={18} />
                </div>
                <div className="integration-details">
                  <span className="integration-name">{acc.name}</span>
                  <span className="integration-account">{acc.identifier}</span>
                </div>
              </div>

              <div>
                {acc.connected ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleToggleConnection(acc.id)}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => handleToggleConnection(acc.id)}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Export & Reset */}
      <section className="settings-card" id="card-data-portability">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Database size={18} /> Data Portability &amp; Reset
            </h3>
            <p className="card-subtitle">
              Export an archive of all your configurations or reset settings back to system defaults.
            </p>
          </div>
        </div>

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Export Settings &amp; Profile Data</span>
            <span className="toggle-desc">
              Download your complete configuration file in standardized JSON format.
            </span>
          </div>
          <button
            type="button"
            id="btn-export-data"
            className="btn btn-secondary"
            onClick={exportSettingsJson}
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Restore Factory Defaults</span>
            <span className="toggle-desc">
              Reset all theme choices, notification toggles, and security preferences back to fresh defaults.
            </span>
          </div>
          <button
            type="button"
            id="btn-restore-defaults"
            className="btn btn-secondary"
            onClick={() => setResetConfirmOpen(true)}
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="modal-backdrop" onClick={() => setResetConfirmOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <RotateCcw size={18} /> Reset All Preferences?
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setResetConfirmOpen(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                This will reset your profile details, theme selections, notifications, and security choices back to factory defaults.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setResetConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  resetToDefaults()
                  setResetConfirmOpen(false)
                }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
