# Apex Studio — User Settings & Preferences Hub

A modern, production-ready React user settings control center engineered for developer platforms, agentic AI suites, and SaaS applications.

---

## ✨ Features & Architecture

### 1. 👤 Profile Information
- **Avatar Manager**: Live avatar upload preview with base64 conversion and 5 instant curated preset avatars.
- **Personal Details**: First Name, Last Name, Display Name, and Username with live URL generation.
- **Email Management**: Primary email with "Verified" badge and interactive modal to dispatch email change verification.
- **Professional Persona**: Job Title, Organization, and Bio with real-time character countdown (max 240 chars).
- **Timezone & Location**: Local timezone dropdown with UTC offsets.
- **Social & Web Links**: GitHub, Twitter / X, LinkedIn, and Portfolio links.

### 2. 🛡️ Security & Authentication
- **Password Management**: Current password, new password with show/hide toggle.
- **Interactive Password Strength Meter**: Live entropy scoring (Weak → Fair → Good → Strong) and dynamic 5-point security requirements checklist (8+ chars, uppercase, lowercase, numbers, symbols).
- **Two-Factor Authentication (2FA)**:
  - Interactive authenticator setup modal with simulated TOTP QR code, copyable secret key, and 6-digit confirmation code verification.
  - Recovery backup codes modal with one-click copy.
- **Active Device Sessions**: Inspect authenticated devices (Windows PC, MacBook Pro, iPhone), locations, IPs, and last active status with per-device "Revoke" and "Revoke All Other Sessions".
- **Danger Zone**: Account deactivation flow and permanent deletion modal with strict `DELETE` text validation.

### 3. 🔔 Notifications & Cadence
- **Multi-Channel Delivery**: Independent toggles for Email Digests, Desktop Browser Push (with "Test Push" simulator), and SMS Alerts.
- **Category Granularity**: Security Alerts (enforced ON), Team Mentions, and Product Announcements.
- **Frequency Schedule**: Instant real-time, Hourly batching, or Daily 9:00 AM summary.
- **Quiet Hours (Do Not Disturb)**: Custom schedule selector (e.g., 22:00 – 08:00) to silence non-critical pings.

### 4. 🎨 Appearance & Personalization
- **Theme Modes**: Visual cards for **Dark (Obsidian)**, **Light (Paper)**, and **System Auto**.
- **Vibrant Accent Palettes**: Dynamic CSS custom property switching between **Electric Indigo**, **Cyber Cyan**, **Neon Emerald**, **Vivid Rose**, and **Solar Amber**.
- **UI Density**: Segmented control for **Compact**, **Comfortable** (default), and **Spacious**.
- **Typography Scaling**: Font size range slider (13px–18px) with real-time text preview.
- **Accessibility**: Reduce Motion toggle for smooth micro-animations vs. low-motion preference.

### 5. 🔒 Privacy & Data Governance
- **Visibility Levels**: Public, Team Only, or Private profile visibility.
- **Activity Status**: Show / hide green online indicator dot.
- **Search Engine Indexing**: Opt-in/out of external search crawler indexing.
- **Connected Services**: OAuth status management for Google Workspace, GitHub, Slack, and Figma.
- **Data Portability**: One-click **Export JSON** to download complete profile and configuration archive.
- **Factory Reset**: Restore all settings back to pristine defaults.

### 6. ⚡ UX Details & Persistence
- **LocalStorage Sync**: Settings seamlessly persist across page reloads.
- **Dirty State Tracking**: Bottom floating action bar appears whenever unsaved edits exist, offering "Discard" and "Save Changes".
- **Instant Search**: Top search bar with `Ctrl+K` / `⌘K` shortcut that automatically jumps to relevant sections based on query keywords.
- **Toast Notifications**: Feedback messages for all operations (saving, theme changes, copying keys, revoking sessions).

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.
