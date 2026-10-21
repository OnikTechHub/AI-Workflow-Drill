import React, { useRef, useState } from 'react'
import {
  Upload,
  Trash2,
  Check,
  CheckCircle,
  Globe,
  Mail,
  Building,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function ProfileTab() {
  const {
    settings,
    updateField,
    presetAvatars,
    addToast
  } = useSettings()

  const { profile } = settings
  const fileInputRef = useRef(null)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [newEmailInput, setNewEmailInput] = useState('')

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('File size must be under 2MB', 'error')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updateField('profile', 'avatar', reader.result)
        addToast('Profile picture updated successfully!', 'success')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetAvatar = () => {
    updateField('profile', 'avatar', presetAvatars[0])
    addToast('Avatar reset to default preset.', 'info')
  }

  const handleSaveEmail = (e) => {
    e.preventDefault()
    if (!newEmailInput || !newEmailInput.includes('@')) {
      addToast('Please enter a valid email address', 'error')
      return
    }
    updateField('profile', 'email', newEmailInput)
    setEmailModalOpen(false)
    setNewEmailInput('')
    addToast('Verification link sent to ' + newEmailInput, 'success')
  }

  return (
    <div className="settings-content-area">
      <div className="section-header">
        <h2 className="section-title">Profile Information</h2>
        <p className="section-desc">
          Manage your personal details, public persona, and how team members identify you across the workspace.
        </p>
      </div>

      {/* Avatar Card */}
      <section className="settings-card" id="card-avatar">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">Profile Photo</h3>
            <p className="card-subtitle">
              Your photo appears on your profile, comments, team activity, and audit logs.
            </p>
          </div>
        </div>

        <div className="avatar-uploader-card">
          <div className="avatar-preview-container">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="avatar-preview-img"
            />
            <div
              className="avatar-upload-overlay"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload"
            >
              <Upload size={20} />
              <span style={{ fontSize: '10px', marginTop: '4px' }}>Change</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-file-input"
          />

          <div className="avatar-actions">
            <div className="avatar-actions-buttons">
              <button
                type="button"
                id="btn-upload-avatar"
                className="btn btn-sm btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Upload New Image
              </button>
              <button
                type="button"
                id="btn-reset-avatar"
                className="btn btn-sm btn-secondary"
                onClick={handleResetAvatar}
              >
                <Trash2 size={14} />
                Reset
              </button>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Or select an instant preset:
              </span>
              <div className="avatar-presets">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`avatar-preset-btn ${profile.avatar === url ? 'active' : ''}`}
                    onClick={() => {
                      updateField('profile', 'avatar', url)
                      addToast('Preset avatar selected', 'info')
                    }}
                    title={`Select avatar preset ${idx + 1}`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Info Card */}
      <section className="settings-card" id="card-basic-info">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">Personal Details</h3>
            <p className="card-subtitle">
              Basic identification information used across workspaces.
            </p>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              className="form-input"
              value={profile.firstName}
              onChange={(e) => updateField('profile', 'firstName', e.target.value)}
              placeholder="e.g. Onik"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="last-name">
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              className="form-input"
              value={profile.lastName}
              onChange={(e) => updateField('profile', 'lastName', e.target.value)}
              placeholder="e.g. Das"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="display-name">
              Display Name
            </label>
            <input
              type="text"
              id="display-name"
              className="form-input"
              value={profile.displayName}
              onChange={(e) => updateField('profile', 'displayName', e.target.value)}
              placeholder="How your name appears to colleagues"
            />
            <span className="form-hint">Shown on your public profile and workspace cards.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <div className="form-input-wrap">
              <span className="input-icon-left" style={{ fontWeight: 600 }}>@</span>
              <input
                type="text"
                id="username"
                className="form-input has-icon-left"
                value={profile.username}
                onChange={(e) => updateField('profile', 'username', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="handle"
              />
            </div>
            <span className="form-hint success">
              <CheckCircle size={12} /> https://apex.flyrank.ai/@{profile.username}
            </span>
          </div>
        </div>

        {/* Email with Verified status & change button */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="form-input-wrap" style={{ flex: 1 }}>
              <Mail className="input-icon-left" size={16} />
              <input
                type="email"
                id="email"
                className="form-input has-icon-left"
                value={profile.email}
                readOnly
                style={{ cursor: 'not-allowed', opacity: 0.9 }}
              />
            </div>
            {profile.isEmailVerified && (
              <span className="nav-badge-pill success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Verified
              </span>
            )}
            <button
              type="button"
              id="btn-change-email"
              className="btn btn-secondary"
              onClick={() => setEmailModalOpen(true)}
            >
              Change Email
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="bio">About / Bio</label>
            <span className="char-counter">
              {profile.bio.length} / 240
            </span>
          </div>
          <textarea
            id="bio"
            className="form-textarea"
            rows={3}
            maxLength={240}
            value={profile.bio}
            onChange={(e) => updateField('profile', 'bio', e.target.value)}
            placeholder="Write a brief professional summary about yourself..."
          />
        </div>

        <div className="card-divider" />

        {/* Professional Details */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Job Title / Role
            </label>
            <div className="form-input-wrap">
              <Briefcase className="input-icon-left" size={16} />
              <input
                type="text"
                id="role"
                className="form-input has-icon-left"
                value={profile.role}
                onChange={(e) => updateField('profile', 'role', e.target.value)}
                placeholder="e.g. Lead Engineer"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company">
              Company / Organization
            </label>
            <div className="form-input-wrap">
              <Building className="input-icon-left" size={16} />
              <input
                type="text"
                id="company"
                className="form-input has-icon-left"
                value={profile.company}
                onChange={(e) => updateField('profile', 'company', e.target.value)}
                placeholder="e.g. Flyrank AI"
              />
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <div className="form-input-wrap">
              <MapPin className="input-icon-left" size={16} />
              <input
                type="text"
                id="location"
                className="form-input has-icon-left"
                value={profile.location}
                onChange={(e) => updateField('profile', 'location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="timezone">
              Timezone
            </label>
            <div className="form-input-wrap">
              <Clock className="input-icon-left" size={16} />
              <select
                id="timezone"
                className="form-select"
                style={{ paddingLeft: '2.6rem' }}
                value={profile.timezone}
                onChange={(e) => updateField('profile', 'timezone', e.target.value)}
              >
                <option value="America/Los_Angeles">Pacific Time (US &amp; Canada) UTC-8</option>
                <option value="America/New_York">Eastern Time (US &amp; Canada) UTC-5</option>
                <option value="Europe/London">London, Edinburgh GMT+0</option>
                <option value="Europe/Berlin">Berlin, Paris, Amsterdam GMT+1</option>
                <option value="Asia/Dhaka">Dhaka, Bangladesh GMT+6</option>
                <option value="Asia/Tokyo">Tokyo, Japan GMT+9</option>
                <option value="Australia/Sydney">Sydney, Melbourne GMT+11</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Social Profiles */}
      <section className="settings-card" id="card-social-links">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">Social &amp; Web Links</h3>
            <p className="card-subtitle">
              Connect your online profiles to feature them on your team directory card.
            </p>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="social-github">GitHub Profile</label>
            <div className="form-input-wrap">
              <LinkIcon className="input-icon-left" size={16} />
              <input
                type="url"
                id="social-github"
                className="form-input has-icon-left"
                value={profile.github}
                onChange={(e) => updateField('profile', 'github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="social-twitter">X (Twitter)</label>
            <div className="form-input-wrap">
              <LinkIcon className="input-icon-left" size={16} />
              <input
                type="url"
                id="social-twitter"
                className="form-input has-icon-left"
                value={profile.twitter}
                onChange={(e) => updateField('profile', 'twitter', e.target.value)}
                placeholder="https://x.com/username"
              />
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="social-linkedin">LinkedIn</label>
            <div className="form-input-wrap">
              <LinkIcon className="input-icon-left" size={16} />
              <input
                type="url"
                id="social-linkedin"
                className="form-input has-icon-left"
                value={profile.linkedin}
                onChange={(e) => updateField('profile', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="social-website">Personal Website / Portfolio</label>
            <div className="form-input-wrap">
              <Globe className="input-icon-left" size={16} />
              <input
                type="url"
                id="social-website"
                className="form-input has-icon-left"
                value={profile.website}
                onChange={(e) => updateField('profile', 'website', e.target.value)}
                placeholder="https://yourdomain.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Change Email Modal */}
      {emailModalOpen && (
        <div className="modal-backdrop" onClick={() => setEmailModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Mail size={18} /> Update Email Address
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setEmailModalOpen(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEmail}>
              <div className="modal-body">
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  A confirmation verification email will be dispatched to your new address. Your current email ({profile.email}) remains active until confirmed.
                </p>
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-new-email">
                    New Work Email
                  </label>
                  <input
                    type="email"
                    id="modal-new-email"
                    className="form-input"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="name@company.com"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEmailModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
