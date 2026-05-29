interface ContactChannelsProps {
  instagramHandle?: string
  contactEmail?: string
  viberNumber?: string
  locationDescription?: string
}

interface ChannelCard {
  label: string
  value: string
  sub: string
}

export default function ContactChannels({
  instagramHandle,
  contactEmail,
  viberNumber,
  locationDescription,
}: ContactChannelsProps) {
  const channels: ChannelCard[] = [
    {
      label: 'Instagram',
      value: instagramHandle ? `@${instagramHandle}` : '@fadelan.26',
      sub: 'DM us directly — fastest response',
    },
    {
      label: 'Email',
      value: contactEmail ?? 'hello@fadelan.com',
      sub: 'We reply within 24 hours',
    },
    {
      label: 'Viber',
      value: viberNumber ?? '+63 XXX XXX XXXX',
      sub: 'Available 9am – 8pm PHT',
    },
    {
      label: 'Meetup',
      value: locationDescription ?? 'Angeles City, PH',
      sub: 'In-person viewing by appointment',
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
        {channels.map((ch) => (
          <div
            key={ch.label}
            className="group relative border border-[#D6CEBE] p-8 transition-colors duration-200 hover:bg-[#EDE6DC]"
          >
            {/* Bronze corner accent */}
            <span className="absolute left-0 top-0 h-px w-6 bg-[#8B6F47] opacity-50" />
            <span className="absolute left-0 top-0 h-6 w-px bg-[#8B6F47] opacity-50" />

            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
              {ch.label}
            </p>
            <p className="mb-1.5 font-['Cormorant_Garamond'] text-[1.5rem] font-normal leading-[1.2] text-[#1A1A1A]">
              {ch.value}
            </p>
            <p className="text-xs leading-[1.6] text-[#8C8275]">
              {ch.sub}
            </p>
            <div className="mt-5 h-px w-6 bg-[rgba(139,111,71,0.3)]" />
          </div>
        ))}
      </div>
    </section>
  )
}