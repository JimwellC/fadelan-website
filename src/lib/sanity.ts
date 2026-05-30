import { createClient }    from 'next-sanity'
import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

export const sanityConfig = {
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     true,
}

export const client = createClient(sanityConfig)

export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token:  process.env.SANITY_API_READ_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function bagImageUrl(source: SanityImageSource, options?: {
  width?:  number
  height?: number
}) {
  const w = options?.width ?? 900
  return builder
    .image(source)
    .width(w)
    .auto('format')
    .quality(90)
    .url()
}

export async function sanityFetch<T>(
  query:   string,
  params:  Record<string, unknown> = {},
  options?: { revalidate?: number | false; tags?: string[] }
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags:       options?.tags,
    },
  })
}

interface InquiryParams {
  bagName:  string
  price:    number
  settings: {
    messengerUrl?:             string
    instagramHandle?:          string
    viberNumber?:              string
    messengerInquiryTemplate:  string
    instagramInquiryTemplate:  string
    viberInquiryTemplate:      string
  }
}

function buildMessage(template: string, bagName: string, price: number): string {
  return template
    .replace('{bagName}', bagName)
    .replace('{price}',   price.toLocaleString('en-PH'))
}

export function buildInquiryUrls({ bagName, price, settings }: InquiryParams) {
  const msg = {
    messenger: buildMessage(settings.messengerInquiryTemplate, bagName, price),
    instagram: buildMessage(settings.instagramInquiryTemplate, bagName, price),
    viber:     buildMessage(settings.viberInquiryTemplate,     bagName, price),
  }

  const messenger = settings.messengerUrl
    ? `${settings.messengerUrl}?text=${encodeURIComponent(msg.messenger)}`
    : null

  const instagram = settings.instagramHandle
    ? `https://ig.me/m/${settings.instagramHandle}`
    : null

  const instagramMessage = settings.instagramHandle ? msg.instagram : null

  const viber = settings.viberNumber
    ? `viber://chat?number=${settings.viberNumber}&text=${encodeURIComponent(msg.viber)}`
    : null

  return { messenger, instagram, instagramMessage, viber }
}

export const CONDITION_LABELS: Record<string, string> = {
  brand_new: 'Brand New',
  like_new:  'Like New',
  excellent: 'Excellent',
  very_good: 'Very Good',
  good:      'Good',
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Available',
  reserved:  'Reserved',
  sold:      'Sold',
}

export const BRAND_LABELS: Record<string, string> = {
  hermes:         'Hermès',
  chanel:         'Chanel',
  louis_vuitton:  'Louis Vuitton',
  dior:           'Dior',
  gucci:          'Gucci',
  celine:         'Celine',
  prada:          'Prada',
  ysl:            'YSL / Saint Laurent',
  bottega_veneta: 'Bottega Veneta',
  fendi:          'Fendi',
  goyard:         'Goyard',
  loewe:          'Loewe',
  balenciaga:     'Balenciaga',
  burberry:       'Burberry',
  valentino:      'Valentino',
  givenchy:       'Givenchy',
  coach:          'Coach',
  michael_kors:   'Michael Kors',
  kate_spade:     'Kate Spade',
  other:          'Other',
}
