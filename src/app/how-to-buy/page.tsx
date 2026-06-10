import { sanityFetch } from "@/lib/sanity";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/lib/queries";
import HowToBuyHero from "@/components/how-to-buy/HowToBuyHero";
import ProcessSteps from "@/components/how-to-buy/ProcessSteps";
import LayawayTerms from "@/components/how-to-buy/LayawayTerms";
import FaqAccordion from "@/components/how-to-buy/FaqAccordion";
import CtaBanner from "@/components/how-to-buy/CtaBanner";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "How to Buy | Fadelan",
  description:
    "Learn how to purchase a pre-loved luxury bag from Fadelan — inquiry, reservation, and delivery explained.",
};

export default async function HowToBuyPage() {
  const settings = await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY);

  return (
    <main className="bg-[#F5F1EC] min-h-screen">
      <HowToBuyHero />
      <ScrollReveal>
      <div className="mx-auto w-full px-6 md:max-w-[70%] md:px-0">
        <ProcessSteps />
          <hr className="border-t border-[#EDE6DC]" />
      </div>
      </ScrollReveal>

      <ScrollReveal>
        <LayawayTerms />
      </ScrollReveal>
      
      <ScrollReveal delay={100}>
      <div className="mx-auto w-full px-6 md:max-w-[70%] md:px-0">
        <FaqAccordion />
      </div>
      </ScrollReveal>
      
      <ScrollReveal delay={50}>
        <CtaBanner />
      </ScrollReveal>
      
    </main>
  );
}