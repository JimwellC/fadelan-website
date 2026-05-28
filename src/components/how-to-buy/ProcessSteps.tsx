import { Search, MessageCircle, ShieldCheck, Package, LucideIcon } from "lucide-react";

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
    <section className="py-14 bg-[#F5F1EC]">
      <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#8C8275] mb-7">
        The Fadelan process
      </p>
      <div className="flex flex-col">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="group flex gap-7 py-8 border-b border-[#EDE6DC] last:border-b-0"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-[#EDE6DC] group-hover:bg-[#8B6F47] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300">
              <step.Icon
                size={17}
                className="text-[#8B6F47] group-hover:text-[#F5F1EC] transition-colors duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8C8275]">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-cormorant text-[24px] font-medium text-[#1A1A1A] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[#8C8275] leading-relaxed max-w-xl">
                {step.desc}
              </p>
            </div>

            {/* Step number */}
            <span className="font-cormorant text-[48px] font-normal text-[#EDE6DC] group-hover:text-[#d6cfc5] leading-none min-w-[56px] text-right self-center transition-colors duration-300">
              {step.num}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}