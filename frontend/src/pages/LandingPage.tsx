import LandingHeader from "@/components/layout/LandingHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProcessSection from "@/components/landing/ProcessSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-obsidian font-geist">
      <LandingHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer theme="light" />
    </div>
  );
}
