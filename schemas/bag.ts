// schemas/bag.ts
// ─────────────────────────────────────────────────────────────
// Field order follows the natural listing workflow:
//   ① Basic Info → ② Photos → ③ Price & Status → ④ Details → ⑤ Description → ⑥ SEO
// ─────────────────────────────────────────────────────────────

import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'
import type { SanityDocument } from 'sanity'

interface BagPreviewSelection {
  title?:        string
  subtitle?:     string
  media?:        unknown
  availability?: string
  price?:        number
}

export const bagSchema = defineType({
  name:  'bag',
  title: 'Bag',
  type:  'document',
  icon:  TagIcon,

  preview: {
    select: {
      title:        'name',
      subtitle:     'brand',
      media:        'photos.0',
      availability: 'availability',
      price:        'price',
    },
    prepare(selection: BagPreviewSelection) {
      const { title, subtitle, media, availability, price } = selection
      const statusEmoji: Record<string, string> = {
        available: '🟢',
        reserved:  '🟡',
        sold:      '⚫',
      }
      const emoji = statusEmoji[availability ?? ''] ?? '⚪'
      return {
        title:    `${emoji} ${title ?? 'Untitled bag'}`,
        subtitle: `${subtitle ?? ''} · ₱${price?.toLocaleString() ?? '—'}`,
        media:    media as any,
      }
    },
  },

  orderings: [
    { title: 'Newest first',       name: 'dateAddedDesc', by: [{ field: 'dateAdded',    direction: 'desc' }] },
    { title: 'Price: High to Low', name: 'priceDesc',     by: [{ field: 'price',        direction: 'desc' }] },
    { title: 'Price: Low to High', name: 'priceAsc',      by: [{ field: 'price',        direction: 'asc'  }] },
    { title: 'Brand (A–Z)',        name: 'brandAsc',      by: [{ field: 'brand',        direction: 'asc'  }] },
    { title: 'Status',             name: 'availabilityAsc', by: [{ field: 'availability', direction: 'asc' }] },
  ],

  groups: [
    { name: 'identity',    title: '① Basic Info',    default: true },
    { name: 'media',       title: '② Photos'                       },
    { name: 'pricing',     title: '③ Price & Status'               },
    { name: 'details',     title: '④ Details'                      },
    { name: 'description', title: '⑤ Description'                  },
    { name: 'meta',        title: '⑥ SEO & Settings'               },
  ],

  fields: [

    // ── ① BASIC INFO ──────────────────────────────────────

    defineField({
      name:  'name',
      title: 'Bag Name',
      type:  'string',
      group: 'identity',
      description:
        'The model name only — do NOT include the brand here. ✅ "Classic Flap, Medium"  ❌ "Chanel Classic Flap Medium"',
      validation: (Rule) =>
        Rule.required().min(2).max(120)
          .error('Please enter the bag name before publishing.'),
    }),

    defineField({
      name:  'brand',
      title: 'Brand',
      type:  'string',
      group: 'identity',
      description:
        'Choose from the list. If the brand is not listed, choose "Other" and write the brand name in the Description tab.',
      options: {
        list: [
          { title: 'Hermès',              value: 'hermes'         },
          { title: 'Chanel',              value: 'chanel'         },
          { title: 'Louis Vuitton',       value: 'louis_vuitton'  },
          { title: 'Dior',               value: 'dior'           },
          { title: 'Gucci',              value: 'gucci'          },
          { title: 'Celine',             value: 'celine'         },
          { title: 'Prada',              value: 'prada'          },
          { title: 'YSL / Saint Laurent', value: 'ysl'            },
          { title: 'Bottega Veneta',      value: 'bottega_veneta' },
          { title: 'Fendi',              value: 'fendi'          },
          { title: 'Goyard',             value: 'goyard'         },
          { title: 'Loewe',              value: 'loewe'          },
          { title: 'Balenciaga',         value: 'balenciaga'     },
          { title: 'Burberry',           value: 'burberry'       },
          { title: 'Valentino',          value: 'valentino'      },
          { title: 'Givenchy',           value: 'givenchy'       },
          { title: 'Coach',              value: 'coach'          },
          { title: 'Michael Kors',       value: 'michael_kors'   },
          { title: 'Kate Spade',         value: 'kate_spade'     },
          { title: 'Other',              value: 'other'          },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().error('Please select a brand before publishing.'),
    }),

    defineField({
      name:  'slug',
      title: 'URL Slug (auto-generated)',
      type:  'slug',
      group: 'identity',
      description:
        "This is the web address for this bag's page. Click Generate to create it automatically — you don't need to change it.",
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
      validation: (Rule) =>
        Rule.required().error('Click Generate to create the URL slug.'),
    }),

    // ── ② PHOTOS ──────────────────────────────────────────

    defineField({
      name:  'photos',
      title: 'Photos',
      type:  'array',
      group: 'media',
      description:
        'Upload at least 6 photos. The FIRST photo is the main listing photo shown in the catalog. Recommended order: 1) Front  2) Back  3) Interior  4) Hardware closeup  5) Next to something for scale  6) Any flaws or wear marks.',
      of: [
        {
          type:    'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name:        'alt',
              title:       'Photo description',
              type:        'string',
              description: 'Briefly describe this photo. Example: "Front view of black Chanel Classic Flap".',
            }),
            defineField({
              name:        'caption',
              title:       'Your internal note (buyers will not see this)',
              type:        'string',
              description: 'Optional note for yourself. Example: "Light corner scuff visible here".',
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .warning('Please upload at least 6 photos before publishing: Front, Back, Interior, Hardware, Scale, and Flaws.'),
      options: { layout: 'grid' },
    }),

    // ── ③ PRICE & STATUS ──────────────────────────────────

    defineField({
      name:        'price',
      title:       'Selling Price (₱ PHP)',
      type:        'number',
      group:       'pricing',
      description: 'Numbers only — no ₱ sign, no commas. Example: type 85000 for ₱85,000.',
      validation:  (Rule) =>
        Rule.required().min(1).integer()
          .error('Please enter the price in Philippine Pesos — numbers only, no ₱ sign.'),
    }),

    defineField({
      name:         'availability',
      title:        'Status',
      type:         'string',
      group:        'pricing',
      description:
        'Update this whenever the bag status changes. Reserved = down payment received. Sold = fully paid and handed over.',
      initialValue: 'available',
      options: {
        list: [
          { title: '🟢 Available — buyers can inquire',                 value: 'available' },
          { title: '🟡 Reserved — down payment received, bag is claimed', value: 'reserved'  },
          { title: '⚫ Sold — fully paid and released to buyer',         value: 'sold'       },
        ],
        layout: 'radio',
      },
      validation: (Rule) =>
        Rule.required().error('Please set the bag status.'),
    }),

    defineField({
      name:         'showWhenSold',
      title:        'Show in Recently Sold after it sells?',
      type:         'boolean',
      group:        'pricing',
      description:
        'Turn ON to show this bag in the Recently Sold section after it sells — great for building buyer trust. Turn OFF to keep it private.',
      initialValue: false,
    }),

    // ── ④ DETAILS ─────────────────────────────────────────

    defineField({
      name:  'condition',
      title: 'Condition',
      type:  'string',
      group: 'details',
      description:
        'Be honest — buyers appreciate it. When in doubt, go one grade lower to avoid disputes.',
      options: {
        list: [
          { title: 'Brand New — never used, original tags still attached',                 value: 'brand_new' },
          { title: 'Like New — barely used, looks brand new, no visible wear',             value: 'like_new'  },
          { title: 'Excellent — light signs of use, only visible on very close inspection', value: 'excellent' },
          { title: 'Very Good — some visible wear but still beautiful and carriable',       value: 'very_good' },
          { title: 'Good — clearly visible wear, priced to reflect it honestly',           value: 'good'      },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().error('Please select the bag condition.'),
    }),

    defineField({
      name:  'color',
      title: 'Main Color',
      type:  'string',
      group: 'details',
      description:
        'Choose the closest color. Write the specific shade name (e.g. "Rouge H", "Caramel") in the Description tab.',
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
      validation: (Rule) =>
        Rule.required().error('Please select the main color.'),
    }),

    defineField({
      name:  'size',
      title: 'Size',
      type:  'string',
      group: 'details',
      description:
        'Measure the longest side of the bag: Mini = under 15cm · Small = 15–20cm · Medium = 20–30cm · Large = 30–40cm · Oversized = over 40cm.',
      options: {
        list: [
          { title: 'Mini — under 15cm',    value: 'mini'      },
          { title: 'Small — 15 to 20cm',   value: 'small'     },
          { title: 'Medium — 20 to 30cm',  value: 'medium'    },
          { title: 'Large — 30 to 40cm',   value: 'large'     },
          { title: 'Oversized — over 40cm', value: 'oversized' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().error('Please select the bag size.'),
    }),

    defineField({
      name:        'material',
      title:       'Material / Leather Type (optional)',
      type:        'string',
      group:       'details',
      description: 'What is the bag made of? Examples: Caviar Leather, Lambskin, Monogram Canvas, Epi Leather, Velvet, Nylon. Leave blank if unsure.',
      validation:  (Rule) => Rule.max(120),
    }),

    defineField({
      name:  'hardware',
      title: 'Hardware Color (optional)',
      type:  'string',
      group: 'details',
      description: 'The color of the metal parts — zippers, clasps, chains.',
      options: {
        list: [
          { title: 'Gold-tone',                        value: 'gold'         },
          { title: 'Silver-tone',                      value: 'silver'       },
          { title: 'Rose gold',                        value: 'rose_gold'    },
          { title: 'Ruthenium / dark gunmetal',        value: 'ruthenium'    },
          { title: 'Brushed gold',                     value: 'brushed_gold' },
          { title: 'Mixed metals',                     value: 'mixed'        },
          { title: 'No metal hardware (fabric/resin)', value: 'none'         },
          { title: 'Other',                            value: 'other'        },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name:        'dimensions',
      title:       'Dimensions (optional)',
      type:        'string',
      group:       'details',
      description: 'Width × Height × Depth in centimeters. Example: 25 × 16 × 7 cm. Helps buyers know if the bag fits their needs.',
      validation:  (Rule) => Rule.max(60),
    }),

    defineField({
      name:        'year',
      title:       'Year or Series (optional)',
      type:        'string',
      group:       'details',
      description: 'If known, enter the year or series. Examples: "2021" or "Series 28 (2019)" for Chanel. Leave blank if unknown.',
      validation:  (Rule) => Rule.max(60),
    }),

    defineField({
      name:        'includes',
      title:       "What comes with this bag?",
      type:        'array',
      group:       'details',
      description: 'Check everything included. Only check what you actually have — buyers will expect these items.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dust bag',               value: 'dust_bag'   },
          { title: 'Original box',           value: 'box'        },
          { title: 'Authenticity card',      value: 'auth_card'  },
          { title: 'Original receipt',       value: 'receipt'    },
          { title: 'Mirror',                 value: 'mirror'     },
          { title: 'Lock and key',           value: 'lock_key'   },
          { title: 'Removable strap',        value: 'strap'      },
          { title: 'Clochette (key holder)', value: 'clochette'  },
          { title: 'Twilly / scarf',         value: 'twilly'     },
          { title: 'Rain cover',             value: 'rain_cover' },
          { title: 'Booklet / care card',    value: 'booklet'    },
        ],
        layout: 'grid',
      },
    }),

    // ── ⑤ DESCRIPTION ────────────────────────────────────

    defineField({
      name:  'description',
      title: 'Bag Description',
      type:  'array',
      group: 'description',
      description:
        'Write an honest, detailed description. Include: specific color shade, any known history, and every flaw no matter how small. Honest listings build trust and prevent disputes.',
      of: [
        {
          type:   'block',
          styles: [
            { title: 'Normal text', value: 'normal' },
            { title: 'Heading',     value: 'h3'     },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em'     },
            ],
          },
          lists: [{ title: 'Bullet list', value: 'bullet' }],
        },
      ],
    }),

    defineField({
      name:        'authenticityNote',
      title:       'Authenticity Note (optional)',
      type:        'text',
      group:       'description',
      rows:        3,
      description: 'How was this bag verified? Example: "Authenticated in-house. Serial code matches production year. Full report available upon reservation."',
      validation:  (Rule) => Rule.max(500),
    }),

    defineField({
      name:        'shippingNote',
      title:       'Special Delivery Note (optional)',
      type:        'string',
      group:       'description',
      description: 'Only fill in if this bag has unusual delivery terms. Example: "Pickup only in Pampanga — no courier for this item." Leave blank to use the default from Site Settings.',
      validation:  (Rule) => Rule.max(200),
    }),

    // ── ⑥ SEO & SETTINGS ─────────────────────────────────

    defineField({
      name:        'seoTitle',
      title:       'Google Page Title (optional)',
      type:        'string',
      group:       'meta',
      description: 'Leave blank — automatically uses "[Brand] [Bag Name] — Fad Élan". Only change if you want something different. Max 60 characters.',
      validation:  (Rule) => Rule.max(60),
    }),

    defineField({
      name:        'seoDescription',
      title:       'Google Search Description (optional)',
      type:        'text',
      group:       'meta',
      rows:        2,
      description: 'The short text shown under the page title in Google results. Leave blank for most bags. Max 160 characters.',
      validation:  (Rule) => Rule.max(160),
    }),

    defineField({
      name:         'dateAdded',
      title:        'Date Added',
      type:         'datetime',
      group:        'meta',
      description:  'Set automatically when first published. Do not change — this controls the Newest First sort order on the website.',
      readOnly:     true,
      initialValue: () => new Date().toISOString(),
    }),

  ],
})