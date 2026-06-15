'use client'

import { useState } from 'react'
import type { BagDropdownItem } from '@/lib/queries'
import ScrollReveal from '../ui/ScrollReveal'

interface ContactInquiryFormProps {
  bags: BagDropdownItem[]
}

export default function ContactInquiryForm({ bags }: ContactInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const selectedBagId = formData.get('bag') as string
    const selectedBag = bags.find(b => b._id === selectedBagId)

    try {
      const res = await fetch('/api/inquire', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    formData.get('name'),
          email:   formData.get('email'),
          bag:     selectedBag?.name ?? formData.get('bag') ?? '',
          message: formData.get('message'),
        }),
      })

      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please message us directly on Instagram or Viber.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-20">
        <ScrollReveal delay={0}>
          <div className="border border-[#D6CEBE] bg-[#F5F1EC] p-10 text-center">
            <div className="mx-auto mb-4 h-px w-8 bg-[#8B6F47]" />

            <p className="mb-2 font-['Cormorant_Garamond'] text-[1.6rem] font-normal text-[#1A1A1A]">
              Message received
            </p>

            <p className="text-sm leading-[1.8] text-[#8C8275]">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>

            <div className="mx-auto mt-4 h-px w-8 bg-[#8B6F47]" />
          </div>
        </ScrollReveal>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20">

      {/* Header */}
      <ScrollReveal delay={0}>
        <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#8B6F47]">
          Or send a message
        </p>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <h2 className="mb-10 font-['Cormorant_Garamond'] text-[2.4rem] font-normal leading-[1.15] text-[#1A1A1A]">
          Send us an inquiry
        </h2>
      </ScrollReveal>

      {/* Form */}
      <ScrollReveal delay={220}>
        <form
          onSubmit={handleSubmit}
          className="border border-[#D6CEBE] bg-[#F5F1EC] p-8 md:p-10"
        >
          {/* Name + Email */}
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

            <ScrollReveal delay={0}>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
                />
              </div>
            </ScrollReveal>

          </div>

          {/* Bag selector */}
          <ScrollReveal delay={180}>
            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
                Which piece are you interested in?
              </label>

              <div className="relative">
                <select name="bag" className="w-full appearance-none border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#8C8275] outline-none focus:border-[#8B6F47]">
                  <option value="">Select a bag or describe below</option>
                  {bags.map((bag) => (
                    <option key={bag._id} value={bag._id}>
                      {bag.name}
                      {bag.availability === 'reserved' ? ' (Reserved)' : ''}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-1.5 w-1.5 rotate-45 border-b border-r border-[#8C8275]" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Message */}
          <ScrollReveal delay={260}>
            <div className="mb-6">
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
                Message
              </label>

              <textarea
                name="message"  
                rows={4}
                placeholder="Questions about condition, provenance, shipping…"
                className="w-full resize-none border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
              />
            </div>
          </ScrollReveal>

          {/* Button */}
          <ScrollReveal delay={340}>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A1A1A] px-8 py-3.5 text-[10px] uppercase tracking-[0.14em] text-[#F5F1EC] transition-colors hover:bg-[#8B6F47] disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send inquiry'}
            </button>
          </ScrollReveal>

          {/* Footer note */}
          <ScrollReveal delay={420}>
            <p className="mt-4 text-[11px] text-[#8C8275]">
              This form sends directly to our email. We do not share your details with third parties.
            </p>
          </ScrollReveal>

        </form>
      </ScrollReveal>
    </section>
  )
}