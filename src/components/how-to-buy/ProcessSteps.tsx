import { Search, MessageCircle, ShieldCheck, Package, LucideIcon } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

type Step = {
  num: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Browse the catalog",
    desc: "Explore our curated selection of authenticated pre-loved bags. Each listing includes detailed photos, condition notes, and provenance where available.",
    Icon: Search,
  },
  {
    num: "02",
    title: "Send an inquiry",
    desc: "Found something you love? Reach out via Instagram DM or email. Include the piece name and any questions — we'll reply within 24 hours.",
    Icon: MessageCircle,
  },
  {
    num: "03",
    title: "Reserve your piece",
    desc: "Once we confirm availability, we'll send you payment details. Your bag is held for 48 hours upon confirmation of your interest.",
    Icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Receive your bag",
    desc: "We ship carefully packaged with full tracking. Local meetup in select areas is available upon request.",
    Icon: Package,
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-[#F5F1EC] py-12 md:py-14">

      <ScrollReveal delay={0}>
        <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.16em] text-[#8C8275] md:mb-7">
          The Fadelan process
        </p>
      </ScrollReveal>

      {/* IMPORTANT: stretch grid items */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 items-stretch">

        {STEPS.map((step, i) => (
          <ScrollReveal key={step.num} delay={120 + i * 90}>
            
            {/* IMPORTANT: full height wrapper */}
            <div className="group relative h-full border border-[#D6CEBE] bg-[#F5F1EC] p-5 transition-colors duration-300 hover:bg-[#EDE6DC] md:p-6 flex flex-col">

              {/* Bronze corner accent */}
              <span className="absolute left-0 top-0 h-px w-5 bg-[#8B6F47] opacity-50" />
              <span className="absolute left-0 top-0 h-5 w-px bg-[#8B6F47] opacity-50" />

              {/* Icon */}
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE6DC] transition-colors duration-300 group-hover:bg-[#8B6F47]">
                <step.Icon
                  size={16}
                  className="text-[#8B6F47] transition-colors duration-300 group-hover:text-[#F5F1EC]"
                />
              </div>

              {/* Step label */}
              <p className="mb-1.5 font-sans text-[10px] uppercase tracking-[0.16em] text-[#8C8275]">
                Step {i + 1}
              </p>

              {/* Title */}
              <h3 className="mb-2 font-cormorant text-[1.3rem] font-medium leading-snug text-[#1A1A1A]">
                {step.title}
              </h3>

              {/* Body — grows to fill space */}
              <p className="text-[12.5px] leading-relaxed text-[#8C8275] flex-1">
                {step.desc}
              </p>

              {/* Ghost number pinned bottom */}
              <p className="mt-4 font-cormorant text-[2.5rem] font-normal leading-none text-[#EDE6DC] transition-colors duration-300 group-hover:text-[#d6cfc5]">
                {step.num}
              </p>

            </div>

          </ScrollReveal>
        ))}

      </div>
    </section>
  );
}