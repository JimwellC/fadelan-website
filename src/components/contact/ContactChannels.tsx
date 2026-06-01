interface ContactChannelsProps {
  instagramHandle?: string
  messengerUrl?: string
  viberNumber?: string
  locationDescription?: string
}

interface ChannelCard {
  label: string
  value: string
  sub: string
  href: string | null
  icon: React.ReactNode
}

const IconInstagram = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const IconMessenger = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.46 5.56 3.742 7.28V22l3.352-1.84c.896.248 1.843.381 2.906.381 5.523 0 10-4.144 10-9.298C22 6.145 17.523 2 12 2zm1.023 12.52l-2.548-2.717-4.976 2.717 5.476-5.815 2.61 2.717 4.913-2.717-5.475 5.815z"/>
  </svg>
)

const IconViber = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.12 14.71l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.696.876z"/>
  </svg>
)

const IconLocation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
  </svg>
)

export default function ContactChannels({
  instagramHandle,
  messengerUrl,
  viberNumber,
  locationDescription,
}: ContactChannelsProps) {
  const channels: ChannelCard[] = [
    {
      label: 'Instagram',
      value: instagramHandle ? `@${instagramHandle}` : '@fadelan.26',
      sub:   'DM us directly — fastest response',
      href:  instagramHandle
        ? `https://instagram.com/${instagramHandle}`
        : 'https://instagram.com/fadelan.26',
      icon:  <IconInstagram />,
    },
    {
      label: 'Messenger',
      value: 'Fad Élan Deluxe Bags',
      sub:   'We reply within the hour',
      href:  messengerUrl ?? `https://www.m.me/Fadelandeluxe`,
      icon:  <IconMessenger />,
    },
    {
      label: 'Viber',
      value: viberNumber ?? '+63 XXX XXX XXXX',
      sub:   'Available 9am – 8pm PHT',
      href:  viberNumber
        ? `viber://chat?number=${viberNumber.replace(/\s+/g, '')}`
        : null,
      icon:  <IconViber />,
    },
    {
      label: 'Meetup',
      value: locationDescription ?? 'Angeles City, PH',
      sub:   'In-person viewing by appointment',
      href:  locationDescription
        ? `https://maps.google.com/?q=${encodeURIComponent(locationDescription)}`
        : null,
      icon:  <IconLocation />,
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
        Reach us directly
      </p>
      <h2 className="mb-10 font-['Cormorant_Garamond'] text-[2.4rem] font-normal leading-[1.15] text-[#1A1A1A]">
        Choose your channel
      </h2>

      <div className="grid grid-cols-1 border border-[#D6CEBE] md:grid-cols-2">
        {channels.map((ch) => {
          const inner = (
            <div className="group relative border border-[#D6CEBE] p-8 transition-colors duration-200 hover:bg-[#EDE6DC]">
              {/* Bronze corner accent */}
              <span className="absolute left-0 top-0 h-px w-6 bg-[#8B6F47] opacity-50" />
              <span className="absolute left-0 top-0 h-6 w-px bg-[#8B6F47] opacity-50" />

              {/* Icon + label row */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[#8B6F47] opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                  {ch.icon}
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
                  {ch.label}
                </p>
              </div>

              <p className="mb-1.5 font-['Cormorant_Garamond'] text-[1.5rem] font-normal leading-[1.2] text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#8B6F47]">
                {ch.value}
              </p>
              <p className="text-xs leading-[1.6] text-[#8C8275]">
                {ch.sub}
              </p>
              <div className="mt-5 h-px w-6 bg-[rgba(139,111,71,0.3)]" />

              {/* Arrow — shows on hover */}
              {ch.href && (
                <span className="absolute bottom-6 right-6 text-[10px] tracking-[0.1em] text-[#8B6F47] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  ↗
                </span>
              )}
            </div>
          )

          return ch.href ? (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith('viber') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="block"
            >
              {inner}
            </a>
          ) : (
            <div key={ch.label}>{inner}</div>
          )
        })}
      </div>
    </section>
  )
}