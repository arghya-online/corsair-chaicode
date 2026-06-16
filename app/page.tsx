import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { HeroSection } from "@/src/components/landing/HeroSection";
import { BentoGrid } from "@/src/components/landing/BentoGrid";
import { AboutSection } from "@/src/components/landing/AboutSection";
import { PricingSection } from "@/src/components/landing/PricingSection";
import { Footer } from "@/src/components/landing/Footer";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-cream text-espresso flex flex-col font-sans selection:bg-peach-soft selection:text-espresso">
      {/* Navigation Header */}
      <Nav user={user} />

      {/* Hero Presentation Section */}
      <HeroSection user={user} />

      {/* Grid Features Section */}
      <BentoGrid />

      {/* Narrative Philosophy Section */}
      <AboutSection />

      {/* Transparent Pricing Grid */}
      <PricingSection />

      {/* Global Landing Footer */}
      <Footer />
    </main>
  );
}
