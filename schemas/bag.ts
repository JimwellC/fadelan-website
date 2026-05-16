// schemas/bag.ts
// ─────────────────────────────────────────────────────────────
// The core document type. Every bag listed on the Fadelan site
// is one "bag" document in Sanity Studio.
//
// Rules:
//  - All filterable fields use string literals (options.list)
//    so staff cannot mistype a value and break catalog filters.
//  - The slug is auto-generated from the bag brand + name.
//  - Photos array: first image = listing cover.
//  - Rich text description allows bold / italic / bullet lists.
//  - Stock states: Available / Reserved / Sold (3 states only —
//    Reserved covers both "reserved" and "on hold" scenarios,
//    meaning a down payment has been sent and the bag is claimed.)
// ─────────────────────────────────────────────────────────────

import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'
import type { SanityDocument } from 'sanity'

export const bagSchema = defineType({
  name:  'bag',
  title: 'Bag',
  type:  'document',
  icon:  TagIcon,

  // ── Preview in Studio list view ──────────────────────────
  preview: {
    select: {
      title:        'name',
      subtitle:     'brand',
      media:        'photos.0',
      availability: 'availability',
      price:        'price',
    },
    prepare(selection: {
        title?:        string
        subtitle?:     string
        media?:        unknown
        availability?: string
        price?:        number
        }) {
        const statusEmoji: Record<string, string> = {
            available: '🟢',
            reserved:  '🟡',
            sold:      '⚫',
        }
        const { title, subtitle, media, availability, price } = selection
        const emoji = statusEmoji[availability ?? ''] ?? '⚪'
        return {
            title:    `${emoji} ${title ?? 'Untitled bag'}`,
            subtitle: `${subtitle ?? ''} · ₱${price?.toLocaleString() ?? '—'}`,
            media:    media as any,  // Sanity passes the image ref internally — type is opaque
        }
        },
  },

  // ── Ordering in Studio ────────────────────────────────────
  orderings: [
    {
      title: 'Date Added (Newest)',
      name:  'dateAddedDesc',
      by: [{ field: 'dateAdded', direction: 'desc' }],
    },
    {
      title: 'Price (High → Low)',
      name:  'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Price (Low → High)',
      name:  'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Brand (A → Z)',
      name:  'brandAsc',
      by: [{ field: 'brand', direction: 'asc' }],
    },
    {
      title: 'Availability',
      name:  'availabilityAsc',
      by: [{ field: 'availability', direction: 'asc' }],
    },
  ],

  groups: [
    { name: 'identity',    title: 'Identity',         default: true },
    { name: 'pricing',     title: 'Pricing & Status'               },
    { name: 'details',     title: 'Details'                        },
    { name: 'media',       title: 'Photos'                         },
    { name: 'description', title: 'Description'                    },
    { name: 'meta',        title: 'SEO / Meta'                     },
  ],

  fields: [

    // ── IDENTITY ──────────────────────────────────────────
    defineField({
      name:  'name',
      title: 'Bag Name',
      type:  'string',
      group: 'identity',
      description:
        'Model name only — do NOT include the brand. E.g. "Classic Flap, Medium" not "Chanel Classic Flap".',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),

    defineField({
      name:  'brand',
      title: 'Brand',
      type:  'string',
      group: 'identity',
      description: 'Select from list. Never type freehand — breaks catalog filters.',
      options: {
        list: [
          { title: 'Hermès',           value: 'hermes'          },
          { title: 'Chanel',           value: 'chanel'          },
          { title: 'Louis Vuitton',    value: 'louis_vuitton'   },
          { title: 'Dior',             value: 'dior'            },
          { title: 'Gucci',            value: 'gucci'           },
          { title: 'Celine',           value: 'celine'          },
          { title: 'Prada',            value: 'prada'           },
          { title: 'YSL / Saint Laurent', value: 'ysl'          },
          { title: 'Bottega Veneta',   value: 'bottega_veneta'  },
          { title: 'Fendi',            value: 'fendi'           },
          { title: 'Goyard',           value: 'goyard'          },
          { title: 'Loewe',            value: 'loewe'           },
          { title: 'Balenciaga',       value: 'balenciaga'      },
          { title: 'Burberry',         value: 'burberry'        },
          { title: 'Valentino',        value: 'valentino'       },
          { title: 'Givenchy',         value: 'givenchy'        },
          { title: 'Coach',            value: 'coach'           },
          { title: 'Michael Kors',     value: 'michael_kors'    },
          { title: 'Kate Spade',       value: 'kate_spade'      },
          { title: 'Other',            value: 'other'           },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:  'slug',
      title: 'URL Slug',
      type:  'slug',
      group: 'identity',
      description: 'Auto-generated from Brand + Bag Name. Click Generate. Only edit if needed.',
      options: {
        source: (doc: SanityDocument) => {
          const brand = (doc.brand as string | undefined) ?? 'bag'
          const name  = (doc.name  as string | undefined) ?? 'item'
          return `${brand}-${name}`
        },
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── PRICING & STATUS ──────────────────────────────────
    defineField({
      name:        'price',
      title:       'Price (PHP)',
      type:        'number',
      group:       'pricing',
      description: 'In Philippine Pesos. Numbers only — no ₱ symbol.',
      validation:  (Rule) => Rule.required().min(1).integer(),
    }),

    defineField({
      name:         'availability',
      title:        'Availability',
      type:         'string',
      group:        'pricing',
      description:
        'Available = open for inquiry. Reserved = down payment received, bag is claimed. Sold = fully paid and released.',
      initialValue: 'available',
      options: {
        list: [
          { title: '🟢 Available', value: 'available' },
          { title: '🟡 Reserved',  value: 'reserved'  },
          { title: '⚫ Sold',      value: 'sold'       },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:         'showWhenSold',
      title:        'Keep visible when sold?',
      type:         'boolean',
      group:        'pricing',
      description:
        'If ON, this bag appears in the "Recently Sold" section for social proof. If OFF, it disappears from the site when marked Sold.',
      initialValue: false,
    }),

    // ── DETAILS ───────────────────────────────────────────
    defineField({
      name:  'condition',
      title: 'Condition',
      type:  'string',
      group: 'details',
      options: {
        list: [
          { title: 'Brand New — Unused, original tags intact',            value: 'brand_new' },
          { title: 'Like New — Carried briefly, no visible wear',         value: 'like_new'  },
          { title: 'Excellent — Minor signs on close inspection only',    value: 'excellent' },
          { title: 'Very Good — Honest visible wear, proudly carriable',  value: 'very_good' },
          { title: 'Good — Well-loved, clearly visible wear',             value: 'good'      },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:  'color',
      title: 'Primary Color',
      type:  'string',
      group: 'details',
      description:
        'Select closest match. Add specific shade in description (e.g. select Brown, then write "Rouge H" in description).',
      options: {
        list: [
          { title: 'Black',  value: 'black'  },
          { title: 'Brown',  value: 'brown'  },
          { title: 'Beige',  value: 'beige'  },
          { title: 'White',  value: 'white'  },
          { title: 'Cream',  value: 'cream'  },
          { title: 'Red',    value: 'red'    },
          { title: 'Pink',   value: 'pink'   },
          { title: 'Purple', value: 'purple' },
          { title: 'Blue',   value: 'blue'   },
          { title: 'Green',  value: 'green'  },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Orange', value: 'orange' },
          { title: 'Gold',   value: 'gold'   },
          { title: 'Silver', value: 'silver' },
          { title: 'Multi',  value: 'multi'  },
          { title: 'Canvas', value: 'canvas' },
          { title: 'Other',  value: 'other'  },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:  'size',
      title: 'Size',
      type:  'string',
      group: 'details',
      description:
        'Measure longest dimension: Mini <15cm · Small 15–20cm · Medium 20–30cm · Large 30–40cm · Oversized 40cm+',
      options: {
        list: [
          { title: 'Mini (under 15cm)',  value: 'mini'     },
          { title: 'Small (15–20cm)',    value: 'small'    },
          { title: 'Medium (20–30cm)',   value: 'medium'   },
          { title: 'Large (30–40cm)',    value: 'large'    },
          { title: 'Oversized (40cm+)', value: 'oversized' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:        'material',
      title:       'Material',
      type:        'string',
      group:       'details',
      description: 'E.g. Caviar Leather, Lambskin, Monogram Canvas, Epi Leather, Nylon',
      validation:  (Rule) => Rule.max(120),
    }),

    defineField({
      name:  'hardware',
      title: 'Hardware',
      type:  'string',
      group: 'details',
      options: {
        list: [
          { title: 'Gold-tone',     value: 'gold'         },
          { title: 'Silver-tone',   value: 'silver'       },
          { title: 'Rose gold',     value: 'rose_gold'    },
          { title: 'Ruthenium',     value: 'ruthenium'    },
          { title: 'Brushed gold',  value: 'brushed_gold' },
          { title: 'Mixed',         value: 'mixed'        },
          { title: 'None / Fabric', value: 'none'         },
          { title: 'Other',         value: 'other'        },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name:        'dimensions',
      title:       'Dimensions',
      type:        'string',
      group:       'details',
      description: 'Optional — e.g. "25 × 16 × 7 cm". Helps serious buyers self-qualify.',
      validation:  (Rule) => Rule.max(60),
    }),

    defineField({
      name:  'year',
      title: 'Year / Series',
      type:  'string',
      group: 'details',
      description:
        'If known — e.g. "Series 28 (2019)" for Chanel, or "2021". Leave blank if unknown.',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name:        'includes',
      title:       "What's Included",
      type:        'array',
      group:       'details',
      description: 'Select everything included with the bag.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dust bag',          value: 'dust_bag'   },
          { title: 'Box',               value: 'box'        },
          { title: 'Authenticity card', value: 'auth_card'  },
          { title: 'Receipt',           value: 'receipt'    },
          { title: 'Mirror',            value: 'mirror'     },
          { title: 'Lock & key',        value: 'lock_key'   },
          { title: 'Strap',             value: 'strap'      },
          { title: 'Clochette',         value: 'clochette'  },
          { title: 'Twilly / scarf',    value: 'twilly'     },
          { title: 'Rain cover',        value: 'rain_cover' },
          { title: 'Booklet / manual',  value: 'booklet'    },
        ],
        layout: 'grid',
      },
    }),

    // ── PHOTOS ────────────────────────────────────────────
    defineField({
      name:  'photos',
      title: 'Photos',
      type:  'array',
      group: 'media',
      description:
        'Minimum 6 photos. Upload in order: Front → Back → Interior → Hardware → Scale → Flaws. First photo = listing cover.',
      of: [
        {
          type:    'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name:        'alt',
              title:       'Alt text',
              type:        'string',
              description: 'Describe the photo for accessibility. E.g. "Front view of black Chanel Classic Flap"',
            }),
            defineField({
              name:        'caption',
              title:       'Caption',
              type:        'string',
              description: 'Optional internal note. E.g. "Corner scuff — clearly visible"',
            }),
          ],
        },
      ],
      // ✓ Warning at 1, error below 1 — encourages 6 without hard-blocking publish
      // Change to .min(6).error(...) once client is trained and consistent
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .warning('Add at least 6 photos before publishing: Front, Back, Interior, Hardware, Scale, Flaws'),
      options: {
        layout: 'grid',
      },
    }),

    // ── DESCRIPTION ───────────────────────────────────────
    defineField({
      name:  'description',
      title: 'Description',
      type:  'array',
      group: 'description',
      description:
        "Describe the bag honestly. Include: what's included, any known history, year if known, and EVERY flaw in plain language.",
      of: [
        {
          type:   'block',
          styles: [
            { title: 'Normal',  value: 'normal' },
            { title: 'Heading', value: 'h3'     },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em'     },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
          ],
        },
      ],
    }),

    defineField({
      name:        'authenticityNote',
      title:       'Authenticity Note',
      type:        'text',
      group:       'description',
      rows:        3,
      description: 'E.g. "Authenticated in-house. Serial code matches production year. Full report available on reservation."',
      validation:  (Rule) => Rule.max(500),
    }),

    defineField({
      name:        'shippingNote',
      title:       'Shipping / Fulfillment Note',
      type:        'string',
      group:       'description',
      // ✓ Removed invalid `placeholder` prop — put guidance in description instead
      description:
        'Leave blank to use the site default. Override only if this bag has special delivery conditions. E.g. "Pickup only — no shipping for this item."',
      validation: (Rule) => Rule.max(200),
    }),

    // ── SEO / META ────────────────────────────────────────
    defineField({
      name:        'seoTitle',
      title:       'SEO Title',
      type:        'string',
      group:       'meta',
      description: 'Optional. Defaults to "[Brand] [Name] — Fadelan". Max 60 characters.',
      validation:  (Rule) => Rule.max(60),
    }),

    defineField({
      name:        'seoDescription',
      title:       'SEO Description',
      type:        'text',
      group:       'meta',
      rows:        2,
      description: 'Optional. Shown in Google search results. Max 160 characters.',
      validation:  (Rule) => Rule.max(160),
    }),

    // ── AUTO DATE ─────────────────────────────────────────
    defineField({
      name:         'dateAdded',
      title:        'Date Added',
      type:         'datetime',
      group:        'meta',
      description:  'Auto-set when bag is first published. Powers "Newest first" sort. Do not edit.',
      readOnly:     true,
      initialValue: () => new Date().toISOString(),
    }),

  ],
})