import { sanityFetch } from "@/lib/sanity";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/lib/queries";
import HowToBuyHero from "@/components/how-to-buy/HowToBuyHero";
import ProcessSteps from "@/components/how-to-buy/ProcessSteps";
import FaqAccordion from "@/components/how-to-buy/FaqAccordion";
import CtaBanner from "@/components/how-to-buy/CtaBanner";

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
      <div className="max-w-[70%] mx-auto">
        <ProcessSteps />
        <hr className="border-t border-[#EDE6DC]" />
      </div>
      <div className="max-w-[70%] mx-auto">
        <FaqAccordion />
      </div>
      <CtaBanner />
    </main>
  );
}