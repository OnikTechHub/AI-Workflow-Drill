import { userSettingsSchema, defaultUserSettings } from '../schemas/userSettingsSchema.ts'

console.log('🧪 Starting UserSettings Schema & Validation Suite...\n')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`)
    passed++
  } else {
    console.error(`  ❌ FAIL: ${message}`)
    failed++
  }
}

// 1. Default settings validation
const defaultResult = userSettingsSchema.safeParse(defaultUserSettings)
assert(defaultResult.success, 'Default user settings must pass validation without errors')

// 2. Strict empty field validation
const emptyFields = [
  { field: 'fullName', value: '', expected: 'Full name cannot be empty' },
  { field: 'username', value: '', expected: 'Username cannot be empty' },
  { field: 'email', value: '', expected: 'Primary email address cannot be empty' },
  { field: 'jobTitle', value: '', expected: 'Job title cannot be empty' },
  { field: 'organization', value: '', expected: 'Organization name cannot be empty' },
  { field: 'bio', value: '', expected: 'Bio cannot be empty' },
]

for (const testCase of emptyFields) {
  const payload = { ...defaultUserSettings, [testCase.field]: testCase.value }
  const result = userSettingsSchema.safeParse(payload)
  assert(!result.success, `Empty ${testCase.field} must be rejected`)
  if (!result.success) {
    const errorMsg = (result.error?.issues || []).find((e) => e.path.includes(testCase.field))?.message
    assert(
      errorMsg?.includes(testCase.expected),
      `Empty ${testCase.field} error message should match "${testCase.expected}" (got: "${errorMsg}")`
    )
  }
}

// 3. Strict invalid email validation
const invalidEmails = [
  'invalid',
  'invalid@',
  'invalid@domain',
  '@domain.com',
  'invalid..email@domain.com',
  'spaces in email@domain.com',
]

for (const badEmail of invalidEmails) {
  const payload = { ...defaultUserSettings, email: badEmail }
  const result = userSettingsSchema.safeParse(payload)
  assert(!result.success, `Invalid email "${badEmail}" must be rejected`)
  if (!result.success) {
    const errorMsg = (result.error?.issues || []).find((e) => e.path.includes('email'))?.message
    assert(
      errorMsg?.includes('valid, deliverable email address'),
      `Invalid email "${badEmail}" error message matches prompt guidance`
    )
  }
}

// 4. Backup email conflict validation (secondary email matches primary)
const conflictPayload = {
  ...defaultUserSettings,
  email: 'alex@apexstudio.io',
  secondaryEmail: 'alex@apexstudio.io',
}
const conflictResult = userSettingsSchema.safeParse(conflictPayload)
assert(!conflictResult.success, 'Backup email matching primary email must be rejected')
if (!conflictResult.success) {
  const errorMsg = (conflictResult.error?.issues || []).find((e) => e.path.includes('secondaryEmail'))?.message
  assert(
    errorMsg?.includes('different from your primary email'),
    `Conflict error message: "${errorMsg}"`
  )
}

// 5. Bio character limits (min 10, max 240)
const shortBioPayload = { ...defaultUserSettings, bio: 'Too short' }
const shortBioResult = userSettingsSchema.safeParse(shortBioPayload)
assert(!shortBioResult.success, 'Bio under 10 chars must be rejected')

const longBioPayload = { ...defaultUserSettings, bio: 'A'.repeat(241) }
const longBioResult = userSettingsSchema.safeParse(longBioPayload)
assert(!longBioResult.success, 'Bio over 240 chars must be rejected')

// 6. Security alert mandatory requirement
const disableSecurityPayload = {
  ...defaultUserSettings,
  notifications: {
    ...defaultUserSettings.notifications,
    securityAlerts: false,
  },
}
const disableSecurityResult = userSettingsSchema.safeParse(disableSecurityPayload)
assert(!disableSecurityResult.success, 'Disabling security alerts must be rejected as mandatory requirement')

console.log(`\n📊 Test Suite Summary: ${passed} Passed, ${failed} Failed.`)
if (failed > 0) process.exit(1)
