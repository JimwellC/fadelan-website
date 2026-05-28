'use client'

import { useState } from 'react'
import type { BagDropdownItem } from '@/lib/queries'

interface ContactInquiryFormProps {
  bags: BagDropdownItem[]
}

export default function ContactInquiryForm({ bags }: ContactInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: wire up email submission (Phase 2 — Resend / Formspree / server action)
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-20">
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
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20">
      <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#8B6F47]">
        Or send a message
      </p>
      <h2 className="mb-10 font-['Cormorant_Garamond'] text-[2.4rem] font-normal leading-[1.15] text-[#1A1A1A]">
        Send us an inquiry
      </h2>

      <form onSubmit={handleSubmit} className="border border-[#D6CEBE] bg-[#F5F1EC] p-8 md:p-10">
        {/* Name + Email */}
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              className="w-full border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="w-full border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
            />
          </div>
        </div>

        {/* Bag selector */}
        <div className="mb-5">
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
            Which piece are you interested in?
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#8C8275] outline-none focus:border-[#8B6F47]"
            >
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

        {/* Message */}
        <div className="mb-6">
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Questions about condition, provenance, shipping…"
            className="w-full resize-none border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C8BFB2] outline-none focus:border-[#8B6F47]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1A1A1A] px-8 py-3.5 text-[10px] uppercase tracking-[0.14em] text-[#F5F1EC] transition-colors hover:bg-[#8B6F47] disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send inquiry'}
        </button>

        <p className="mt-4 text-[11px] text-[#8C8275]">
          This form sends directly to our email. We do not share your details with third parties.
        </p>
      </form>
    </section>
  )
}