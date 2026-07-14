// src/lib/revalidate.ts
//
// The custom admin panel writes to Sanity directly with `writeClient`, which
// bypasses Sanity Studio and therefore never fires the Studio webhook at
// /api/revalidate. Without this, a bag added or edited in the admin would sit
// behind the ISR cache for up to `revalidate` seconds before appearing.
//
// Calling these from the admin API routes after a successful write makes the
// public site update immediately — so the page-level `revalidate` values are
// just a safety net, not the mechanism the client depends on.

import { revalidatePath } from 'next/cache'

/** Refresh every public surface a bag appears on. */
export function revalidateBag(slug?: string) {
  revalidatePath('/')          // homepage featured grid
  revalidatePath('/catalog')   // catalog listing
  if (slug) {
    revalidatePath(`/catalog/${slug}`)  // the bag's own detail page
  }
}