import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureBadges } from "@/components/FeatureBadges";
import { Products } from "@/components/Products";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { SupportProcess } from "@/components/SupportProcess";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

export default function HomePage() {
  return (
    <div className="bg-slate-50 dark:bg-[#050b1a] min-h-screen transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <FeatureBadges />
        <Products />
        <WhyChooseUs />
        <SupportProcess />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
