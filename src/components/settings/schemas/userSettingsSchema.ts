import { z } from 'zod'

/**
 * Strict regex for valid email format:
 * - Requires alphanumeric/safe chars
 * - Forbids leading, trailing, or consecutive dots in local part
 * - Requires valid domain with at least 2-character TLD
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/


/**
 * Strict regex for usernames:
 * - Lowercase alphanumeric, hyphens, and underscores
 * - Must start and end with an alphanumeric character
 * - 3 to 30 characters
 */
const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/

export const userSettingsSchema = z
  .object({
    fullName: z
      .string({
        required_error: 'Full name is required',
        invalid_type_error: 'Full name must be text',
      })
      .trim()
      .min(1, 'Full name cannot be empty')
      .min(2, 'Full name must be at least 2 characters')
      .max(70, 'Full name cannot exceed 70 characters'),

    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be text',
      })
      .trim()
      .toLowerCase()
      .min(1, 'Username cannot be empty')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        USERNAME_REGEX,
        'Username must contain only lowercase letters, numbers, hyphens, or underscores, and cannot start or end with a symbol'
      ),

    email: z
      .string({
        required_error: 'Primary email is required',
        invalid_type_error: 'Primary email must be a valid email',
      })
      .trim()
      .min(1, 'Primary email address cannot be empty')
      .regex(EMAIL_REGEX, 'Please enter a valid, deliverable email address (e.g., alex.chen@example.com)'),

    secondaryEmail: z
      .string()
      .trim()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .refine(
        (val) => !val || EMAIL_REGEX.test(val),
        'Please enter a valid backup email address (e.g., backup@domain.com)'
      ),

    jobTitle: z
      .string({
        required_error: 'Job title is required',
        invalid_type_error: 'Job title must be text',
      })
      .trim()
      .min(1, 'Job title cannot be empty')
      .min(2, 'Job title must be at least 2 characters')
      .max(80, 'Job title cannot exceed 80 characters'),

    organization: z
      .string({
        required_error: 'Organization name is required',
        invalid_type_error: 'Organization must be text',
      })
      .trim()
      .min(1, 'Organization name cannot be empty')
      .min(2, 'Organization must be at least 2 characters')
      .max(80, 'Organization cannot exceed 80 characters'),

    bio: z
      .string({
        required_error: 'Bio is required',
        invalid_type_error: 'Bio must be text',
      })
      .trim()
      .min(1, 'Bio cannot be empty')
      .min(10, 'Bio must be at least 10 characters so team members can identify your role')
      .max(240, 'Bio cannot exceed 240 characters'),

    timezone: z
      .string({
        required_error: 'Please select a timezone',
      })
      .min(1, 'Please select your active timezone'),

    country: z
      .string({
        required_error: 'Please select a country or region',
      })
      .min(1, 'Please select your country or region'),

    website: z
      .string()
      .trim()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          try {
            const url = new URL(val)
            return url.protocol === 'http:' || url.protocol === 'https:'
          } catch {
            return false
          }
        },
        'Website must be a valid URL starting with http:// or https://'
      ),

    github: z
      .string()
      .trim()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .refine(
        (val) => !val || /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(val),
        'Enter a valid GitHub username without slashes or @'
      ),

    profileVisibility: z.enum(['public', 'team', 'private'], {
      required_error: 'Please select profile visibility level',
    }),

    themePreference: z.enum(['system', 'dark', 'light'], {
      required_error: 'Please select your preferred theme mode',
    }),

    notifications: z.object({
      securityAlerts: z.boolean().refine((val) => val === true, {
        message: 'Security alerts must remain enabled for account protection',
      }),
      mentionNotifications: z.boolean(),
      productUpdates: z.boolean(),
      weeklyDigest: z.boolean(),
    }),

    twoFactorAuth: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.secondaryEmail && data.email) {
        return data.secondaryEmail.toLowerCase() !== data.email.toLowerCase()
      }
      return true
    },
    {
      message: 'Backup email must be different from your primary email',
      path: ['secondaryEmail'],
    }
  )

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>

export const defaultUserSettings: UserSettingsFormData = {
  fullName: 'Alex Chen',
  username: 'alexchen',
  email: 'alex.chen@apexstudio.io',
  secondaryEmail: 'alex.chen.personal@gmail.com',
  jobTitle: 'Principal Staff Engineer',
  organization: 'Apex Studio AI',
  bio: 'Building next-generation developer tooling, multi-agent workflows, and high-performance interactive web systems.',
  timezone: 'America/Los_Angeles',
  country: 'US',
  website: 'https://alexchen.dev',
  github: 'alexchen-dev',
  profileVisibility: 'team',
  themePreference: 'dark',
  notifications: {
    securityAlerts: true,
    mentionNotifications: true,
    productUpdates: false,
    weeklyDigest: true,
  },
  twoFactorAuth: true,
}
