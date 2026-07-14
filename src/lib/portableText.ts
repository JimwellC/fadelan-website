// src/lib/portableText.ts
//
// The custom admin panel edits `description` in a plain <textarea>, but Sanity
// Studio stores it as Portable Text (an array of blocks). Both write to the
// same field, so bags saved via the admin ended up with a raw string where the
// detail page expected blocks — <PortableText> then logged
// `Unknown block type "undefined"` and rendered NOTHING, silently hiding the
// description on the live page.
//
// These helpers normalise in both directions so the CMS holds one consistent
// shape (Portable Text) regardless of which editor wrote it.

import type { PortableTextBlock } from '@portabletext/types'

/**
 * Plain text -> Portable Text blocks. Blank lines become separate paragraphs.
 * Use this in the admin API routes before writing to Sanity.
 */
export function toPortableText(text: unknown): PortableTextBlock[] {
  // Already Portable Text (e.g. edited in Studio) — pass through untouched.
  if (Array.isArray(text)) return text as PortableTextBlock[]

  if (typeof text !== 'string' || !text.trim()) return []

  return text
    .split(/\n{2,}/)                 // blank line = paragraph break
    .map((p) => p.trim())
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `blk${i}${Math.random().toString(36).slice(2, 8)}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `spn${i}${Math.random().toString(36).slice(2, 8)}`,
          text: para,
          marks: [],
        },
      ],
    })) as unknown as PortableTextBlock[]
}

/**
 * Portable Text blocks -> plain text. Used to populate the admin textarea so
 * the client can edit a description that was originally written in Studio
 * without it being destroyed.
 */
export function fromPortableText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block: any) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return ''
      return block.children.map((c: any) => c?.text ?? '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}