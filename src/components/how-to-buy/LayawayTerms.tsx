import ScrollReveal from "../ui/ScrollReveal";

export default function LayawayTerms() {
  return (
    <section className="bg-[#EDE6DC] px-4 py-12 md:px-10 md:py-16">
      <div className="mx-auto w-full md:max-w-[70%]">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-4 border-b border-[#D6CEBE] pb-6 md:flex-row md:items-end md:justify-between md:gap-0">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
                Payment plan
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-[clamp(1.6rem,4vw,2rem)] font-normal leading-[1.2] text-[#1A1A1A]">
                Layaway terms<br className="hidden md:block" /> & conditions
              </h2>
            </div>
            <div className="md:text-right">
              <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#8C8275]">
                Available from
              </p>
              <p className="font-['Cormorant_Garamond'] text-[1.6rem] leading-none text-[#8B6F47]">
                ₱ 40,000
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Intro */}
        <ScrollReveal>
          <p className="mb-8 max-w-[520px] text-sm leading-[1.85] text-[#8C8275]">
            To provide a seamless and exclusive shopping experience, layaway is available for selected purchases starting at ₱40,000 and above.
          </p>
        </ScrollReveal>

        {/* Terms list */}
        <ul className="divide-y divide-[#D6CEBE]">
          
          <ScrollReveal delay={100}>
            <li className="grid grid-cols-[28px_1fr] gap-4 py-5 first:pt-0">
              <span className="font-['Cormorant_Garamond'] pt-0.5 text-[1.1rem] leading-none text-[#8B6F47]">
                01
              </span>
              <div>
                <p className="mb-1 text-[13px] font-medium text-[#1A1A1A]">
                  Non-refundable down payment
                </p>
                <p className="text-[12.5px] leading-[1.8] text-[#8C8275]">
                  A <strong className="font-medium text-[#1A1A1A]">30% non-refundable down payment</strong> is required to reserve your item. No discount shall be applied. The 30% down payment is computed based on the <strong className="font-medium text-[#1A1A1A]">original price</strong>.
                </p>
              </div>
            </li>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <li className="grid grid-cols-[28px_1fr] gap-4 py-5">
              <span className="font-['Cormorant_Garamond'] pt-0.5 text-[1.1rem] leading-none text-[#8B6F47]">
                02
              </span>
              <div>
                <p className="mb-1 text-[13px] font-medium text-[#1A1A1A]">
                  Balance settlement
                </p>
                <p className="text-[12.5px] leading-[1.8] text-[#8C8275]">
                  The remaining balance may be settled within <strong className="font-medium text-[#1A1A1A]">1–2 months</strong> through flexible payment arrangements.
                </p>
              </div>
            </li>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <li className="grid grid-cols-[28px_1fr] gap-4 py-5">
              <span className="font-['Cormorant_Garamond'] pt-0.5 text-[1.1rem] leading-none text-[#8B6F47]">
                03
              </span>
              <div>
                <p className="mb-1 text-[13px] font-medium text-[#1A1A1A]">
                  Item release
                </p>
                <p className="text-[12.5px] leading-[1.8] text-[#8C8275]">
                  Reserved items will only be released <strong className="font-medium text-[#1A1A1A]">upon full payment</strong>. The bag remains in our custody until the balance is cleared.
                </p>
              </div>
            </li>
          </ScrollReveal>

          <ScrollReveal delay={340}>
            <li className="grid grid-cols-[28px_1fr] gap-4 py-5 last:pb-0">
              <span className="font-['Cormorant_Garamond'] pt-0.5 text-[1.1rem] leading-none text-[#8B6F47]">
                04
              </span>
              <div>
                <p className="mb-1 text-[13px] font-medium text-[#1A1A1A]">
                  Cancellation & forfeiture
                </p>
                <p className="text-[12.5px] leading-[1.8] text-[#8C8275]">
                  Failure to complete payment within the agreed 2-month period will automatically result in <strong className="font-medium text-[#1A1A1A]">cancellation of the layaway agreement</strong>. All down payments made shall be <strong className="font-medium text-[#1A1A1A]">forfeited</strong>.
                </p>
              </div>
            </li>
          </ScrollReveal>

        </ul>

        {/* Footer note */}
        <ScrollReveal delay={420}>
          <div className="mt-8 border border-[#D6CEBE] bg-[#F5F1EC] px-6 py-5">
            <p className="text-xs italic leading-[1.8] text-[#8C8275]">
              Thank you for your understanding and continued trust. If you have questions about the layaway process, please don't hesitate to reach out before committing.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}