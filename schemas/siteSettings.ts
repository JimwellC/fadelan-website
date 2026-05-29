// schemas/siteSettings.ts
// ─────────────────────────────────────────────────────────────
// Singleton document — only one instance ever exists.
// Singleton enforcement is handled in sanity.config.ts via
// schema.templates filter + document.actions filter.
// Do NOT add __experimental_actions here — it is removed in v3.
//
// Stores global site config: socials, contact links, shipping
// defaults, homepage featured bag selection, and brand copy.
//
// Access in Studio via: Content → Site Settings
// ─────────────────────────────────────────────────────────────

import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsSchema = defineType({
  name:  'siteSettings',
  title: 'Site Settings',
  type:  'document',
  icon:  CogIcon,

  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },

  groups: [
    { name: 'brand',    title: 'Brand',           default: true },
    { name: 'contact',  title: 'Contact & Social'               },
    { name: 'inquiry',  title: 'Inquiry Messages'               },
    { name: 'homepage', title: 'Homepage'                       },
    { name: 'shipping', title: 'Shipping & Pickup'              },
  ],

  fields: [

    // ── BRAND ────────────────────────────────────────────
    defineField({
      name:         'siteName',
      title:        'Site Name',
      type:         'string',
      group:        'brand',
      initialValue: 'Fadelan',
      validation:   (Rule) => Rule.required(),
    }),

    defineField({
      name:         'tagline',
      title:        'Tagline',
      type:         'string',
      group:        'brand',
      description:  'Short brand statement shown in hero and footer.',
      initialValue: 'Curated authentic pre-loved luxury.',
    }),

    defineField({
      name:        'logo',
      title:       'Logo',
      type:        'image',
      group:       'brand',
      description: 'Upload SVG or high-res PNG. Used in header and OG images.',
      options:     { hotspot: false },
    }),

    defineField({
      name:        'favicon',
      title:       'Favicon',
      type:        'image',
      group:       'brand',
      description: 'Square image, at least 512×512px.',
    }),

    defineField({
      name:        'ogImage',
      title:       'Default Social Share Image',
      type:        'image',
      group:       'brand',
      description: 'Shown when someone shares the site on Facebook or iMessage. Recommended: 1200×630px.',
      options:     { hotspot: true },
    }),

    // ── CONTACT & SOCIAL ─────────────────────────────────
    defineField({
      name:        'messengerUrl',
      title:       'Facebook Messenger URL',
      type:        'url',
      group:       'contact',
      description: 'E.g. https://m.me/YOUR_PAGE_USERNAME',
      validation:  (Rule) =>
        Rule.uri({ scheme: ['https'] }).warning('Should start with https://m.me/'),
    }),

    defineField({
      name:        'facebookPageUrl',
      title:       'Facebook Page URL',
      type:        'url',
      group:       'contact',
      description: 'E.g. https://www.facebook.com/fadelan',
    }),

    defineField({
      name:        'instagramHandle',
      title:       'Instagram Handle',
      type:        'string',
      group:       'contact',
      description: 'Without the @ sign. E.g. fadelan.26',
    }),

    defineField({
      name:        'viberNumber',
      title:       'Viber Number',
      type:        'string',
      group:       'contact',
      // ✓ Strict international format with helpful error — rejects 09171234567,
      // accepts +639171234567. Required for Viber deep links to work correctly.
      description: 'International format only. E.g. +639171234567 — NOT 09171234567.',
      validation:  (Rule) =>
        Rule.regex(/^\+\d{10,15}$/, {
          name:    'international phone format',
          invert:  false,
        }).warning('Use international format: +639171234567, not 09171234567'),
    }),

    defineField({
      name:        'contactEmail',
      title:       'Email Address (optional)',
      type:        'string',
      group:       'contact',
      description: 'Shown on the Contact page if provided.',
    }),

    defineField({
      name:         'locationDescription',
      title:        'Location Description',
      type:         'string',
      group:        'contact',
      description:  'Shown on About and Contact pages.',
      initialValue: 'Angeles / Pampanga area, Philippines',
    }),

    // ── INQUIRY MESSAGES ─────────────────────────────────
    // {bagName} and {price} are replaced dynamically on the bag detail page.
    // All three are required — without them the inquiry buttons produce blank messages.
    defineField({
      name:         'messengerInquiryTemplate',
      title:        'Messenger Inquiry Message',
      type:         'string',
      group:        'inquiry',
      description:  'Use {bagName} and {price} as placeholders — replaced automatically.',
      initialValue: "Hi Fadelan! I'm interested in the {bagName} (₱{price}). Is it still available?",
      validation:   (Rule) => Rule.required(),
    }),

    defineField({
      name:         'instagramInquiryTemplate',
      title:        'Instagram DM Message',
      type:         'string',
      group:        'inquiry',
      description:  'Shown as a copy prompt on the bag page — Instagram does not support pre-filled DMs.',
      initialValue: "Hi Fadelan! I'm interested in the {bagName} (₱{price}). Is it still available?",
      validation:   (Rule) => Rule.required(),
    }),

    defineField({
      name:         'viberInquiryTemplate',
      title:        'Viber Message',
      type:         'string',
      group:        'inquiry',
      initialValue: "Hi Fadelan! I'm interested in the {bagName} (₱{price}). Is it still available?",
      validation:   (Rule) => Rule.required(),
    }),

    // ── HOMEPAGE ─────────────────────────────────────────
    defineField({
      name:        'featuredBags',
      title:       'Featured Bags (Homepage)',
      type:        'array',
      group:       'homepage',
      description: 'Choose 8–12 bags to feature on the homepage. Drag to reorder. Leave empty to auto-show newest available bags.',
      of: [
        {
          type: 'reference',
          to:   [{ type: 'bag' }],
          options: {
            filter: 'availability == "available"',
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),

    defineField({
      name:         'heroHeadline',
      title:        'Homepage Hero Headline',
      type:         'string',
      group:        'homepage',
      description:  'Main large headline on the homepage.',
      initialValue: 'Carried before. Coveted still.',
    }),

    defineField({
      name:         'heroSubline',
      title:        'Homepage Hero Subline',
      type:         'text',
      group:        'homepage',
      rows:         2,
      initialValue:
        'A quiet, curated collection of authenticated pre-loved luxury bags — sourced with care, photographed honestly, and offered with a promise.',
    }),

    defineField({
      name:        'heroImage',
      title:       'Homepage Hero Image',
      type:        'image',
      group:       'homepage',
      description: 'Dedicated hero image — NOT a bag photo. Upload a high-quality portrait or lifestyle shot. Recommended: 1200×1600px.',
      options:     { hotspot: true },
    }),

    // ── SHIPPING ─────────────────────────────────────────
    defineField({
      name:         'defaultShippingNote',
      title:        'Default Shipping Note',
      type:         'string',
      group:        'shipping',
      description:  'Shown on every bag detail page unless the bag overrides it.',
      initialValue: 'Available for personal pickup in Pampanga or nationwide / international shipping.',
    }),

    defineField({
      name:    'paymentMethods',
      title:   'Accepted Payment Methods',
      type:    'array',
      group:   'shipping',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'GCash',            value: 'gcash'          },
          { title: 'Bank Transfer',    value: 'bank_transfer'  },
          { title: 'PayMaya',          value: 'paymaya'        },
          { title: 'Cash on Meetup',   value: 'cash'           },
          { title: 'Installment Plan', value: 'installment'    },
          { title: 'Western Union',    value: 'western_union'  },
          { title: 'Wise',             value: 'wise'           },
        ],
        layout: 'grid',
      },
    }),

  ],
})