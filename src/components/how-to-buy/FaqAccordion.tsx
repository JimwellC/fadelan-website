"use client";

import { useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";

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
    <section className="px-4 py-10 md:px-10 md:py-14">

      {/* Header */}
      <ScrollReveal delay={0}>
        <h2 className="mb-7 font-[Cormorant_Garamond] text-[clamp(1.5rem,4vw,1.75rem)] font-normal text-[#1A1A1A]">
          Common questions
        </h2>
      </ScrollReveal>

      {/* FAQ list */}
      <div>
        {FAQS.map((faq, i) => {
          const isOpen = open === i;

          return (
            <ScrollReveal key={i} delay={120 + i * 80}>
              <div className="border-b border-[#EDE6DC] first:border-t">

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 py-5 text-left"
                >
                  <span className="font-[Cormorant_Garamond] text-base font-medium text-[#1A1A1A] md:text-lg">
                    {faq.q}
                  </span>

                  <span
                    className={`flex-shrink-0 text-[#8B6F47] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {/* Smooth content reveal */}
                <div
                  className={`grid transition-all duration-300 ease-luxury ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-5"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-[#8C8275]">
                      {faq.a}
                    </p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}