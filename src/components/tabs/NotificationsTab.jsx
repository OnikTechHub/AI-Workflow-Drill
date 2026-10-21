import React, { useState } from 'react'
import {
  Bell,
  Mail,
  Smartphone,
  ShieldAlert,
  Users,
  Sparkles,
  Moon,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function NotificationsTab() {
  const { settings, updateField, addToast } = useSettings()
  const { notifications } = settings
  const [testingPush, setTestingPush] = useState(false)

  const handleTestPushNotification = () => {
    setTestingPush(true)
    setTimeout(() => {
      setTestingPush(false)
      addToast('🔔 Test Notification: Apex agent workflow completed successfully!', 'info')
    }, 800)
  }

  return (
    <div className="settings-content-area">
      <div className="section-header">
        <h2 className="section-title">Notification Preferences</h2>
        <p className="section-desc">
          Choose which events trigger alerts and select your preferred communication channels.
        </p>
      </div>

      {/* Delivery Channels */}
      <section className="settings-card" id="card-delivery-channels">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Bell size={18} /> Communication Channels
            </h3>
            <p className="card-subtitle">
              Configure where you receive updates and alerts.
            </p>
          </div>
        </div>

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Email Notifications</span>
            <span className="toggle-desc">
              Receive formatted updates at <strong>{settings.profile.email}</strong>.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-email-digest"
              checked={notifications.emailDigest}
              onChange={(e) => updateField('notifications', 'emailDigest', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Browser Desktop Push</span>
            <span className="toggle-desc">
              Receive instant desktop notifications for high-priority team mentions and task assignments.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {notifications.browserPush && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleTestPushNotification}
                disabled={testingPush}
              >
                <Send size={12} />
                {testingPush ? 'Sending...' : 'Test Push'}
              </button>
            )}
            <label className="switch">
              <input
                type="checkbox"
                id="switch-browser-push"
                checked={notifications.browserPush}
                onChange={(e) => {
                  updateField('notifications', 'browserPush', e.target.checked)
                  if (e.target.checked) {
                    addToast('Desktop notifications enabled.', 'success')
                  }
                }}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">SMS Notifications</span>
            <span className="toggle-desc">
              Receive text messages for emergency security locks and server outages.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-sms-alerts"
              checked={notifications.smsAlerts}
              onChange={(e) => updateField('notifications', 'smsAlerts', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {notifications.smsAlerts && (
          <div className="form-group" style={{ maxWidth: '340px', marginTop: '0.5rem' }}>
            <label className="form-label" htmlFor="notification-phone">
              Verified Mobile Number
            </label>
            <div className="form-input-wrap">
              <Smartphone className="input-icon-left" size={16} />
              <input
                type="tel"
                id="notification-phone"
                className="form-input has-icon-left"
                value={notifications.phoneNumber}
                onChange={(e) => updateField('notifications', 'phoneNumber', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        )}
      </section>

      {/* Notification Categories */}
      <section className="settings-card" id="card-notification-topics">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Users size={18} /> Alert Categories &amp; Triggers
            </h3>
            <p className="card-subtitle">
              Choose which events you want to be notified about.
            </p>
          </div>
        </div>

        {/* Security alerts (required) */}
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Security &amp; Account Alerts
              <span className="nav-badge-pill warning">Required</span>
            </span>
            <span className="toggle-desc">
              Crucial notifications about password changes, unknown logins, and API token revocations.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-security-alerts"
              checked={true}
              disabled
            />
            <span className="switch-slider" />
          </label>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Team Mentions &amp; Replies</span>
            <span className="toggle-desc">
              Whenever a coworker tags @{settings.profile.username} in a comment, ticket, or drill.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-team-mentions"
              checked={notifications.teamMentions}
              onChange={(e) => updateField('notifications', 'teamMentions', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Product News &amp; Release Notes</span>
            <span className="toggle-desc">
              Feature spotlights, performance tips, and monthly changelog roundups.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-product-updates"
              checked={notifications.productUpdates}
              onChange={(e) => updateField('notifications', 'productUpdates', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </section>

      {/* Cadence & Quiet Hours */}
      <section className="settings-card" id="card-notification-cadence">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Clock size={18} /> Cadence &amp; Quiet Hours
            </h3>
            <p className="card-subtitle">
              Control delivery timing to protect your focus and deep work hours.
            </p>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label className="form-label" htmlFor="notification-frequency">
            Delivery Frequency
          </label>
          <select
            id="notification-frequency"
            className="form-select"
            value={notifications.frequency}
            onChange={(e) => updateField('notifications', 'frequency', e.target.value)}
          >
            <option value="instant">Instant (Real-time delivery)</option>
            <option value="hourly">Hourly Digest (Batched alerts)</option>
            <option value="daily">Daily Summary (Sent every morning at 9:00 AM)</option>
          </select>
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Quiet Hours / Do Not Disturb</span>
            <span className="toggle-desc">
              Mute non-critical notifications during your rest hours.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-quiet-hours"
              checked={notifications.quietHoursEnabled}
              onChange={(e) => updateField('notifications', 'quietHoursEnabled', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {notifications.quietHoursEnabled && (
          <div className="form-grid-2" style={{ maxWidth: '480px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="quiet-start">
                Quiet Hours Start
              </label>
              <input
                type="time"
                id="quiet-start"
                className="form-input"
                value={notifications.quietHoursStart}
                onChange={(e) => updateField('notifications', 'quietHoursStart', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quiet-end">
                Quiet Hours End
              </label>
              <input
                type="time"
                id="quiet-end"
                className="form-input"
                value={notifications.quietHoursEnd}
                onChange={(e) => updateField('notifications', 'quietHoursEnd', e.target.value)}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
