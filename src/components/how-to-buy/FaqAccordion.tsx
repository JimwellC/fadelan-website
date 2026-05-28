"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Are all bags authenticated?",
    a: "Yes — every piece in the Fadelan catalog has been personally verified. We provide authentication cards or receipts where available, and detailed condition notes on every listing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfer, GCash, and Maya. Payment details are shared once we confirm availability. We do not accept cash on delivery for shipped orders.",
  },
  {
    q: "Do you ship nationwide?",
    a: "Yes, we ship to all major areas in the Philippines via LBC or J&T. Shipping fees are shouldered by the buyer. We package every bag carefully with full insurance on high-value items.",
  },
  {
    q: "Can I return or exchange a piece?",
    a: "All sales are final. We encourage you to ask for additional photos or a video walkthrough before committing. We're happy to answer any questions before purchase.",
  },
  {
    q: "Can I meet up to view the bag in person?",
    a: "Local meetups are available in select areas — mention this when you inquire and we'll coordinate. Safe meetup spots in public locations only.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-10 py-14">
      <h2 className="font-[Cormorant_Garamond] text-[28px] font-normal text-[#1A1A1A] mb-7">
        Common questions
      </h2>
      <div>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="border-b border-[#EDE6DC] first:border-t"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center gap-3 py-5 text-left"
            >
              <span className="font-[Cormorant_Garamond] text-lg font-medium text-[#1A1A1A]">
                {faq.q}
              </span>
              <span
                className={`text-[#8B6F47] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {open === i && (
              <p className="text-sm text-[#8C8275] leading-relaxed pb-5">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}