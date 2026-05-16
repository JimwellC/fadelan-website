// schemas/index.ts
// ─────────────────────────────────────────────────────────────
// Registers all Sanity document types.
// Import new schemas here when added in Phase 2.
// ─────────────────────────────────────────────────────────────

import { bagSchema }          from './bag'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  bagSchema,
  siteSettingsSchema,
]