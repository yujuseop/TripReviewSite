import HeroSlider from "@/components/landing/HeroSlider";
import FeatureSection from "@/components/landing/FeatureSection";
import CtaSection from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSlider />
      <FeatureSection />
      <CtaSection />
    </main>
  );
}
