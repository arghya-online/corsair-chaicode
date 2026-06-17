import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { HeroSection } from "@/src/components/landing/HeroSection";
import { ProductShowcase } from "@/src/components/landing/ProductShowcase";
import { FeaturesSection } from "@/src/components/landing/FeaturesSection";
import { ScrollTrackedSection } from "@/src/components/landing/ScrollTrackedSection";
import { WorkflowSection } from "@/src/components/landing/WorkflowSection";
import { PricingSection } from "@/src/components/landing/PricingSection";
import { Footer } from "@/src/components/landing/Footer";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex flex-col font-sans selection:bg-peach-soft selection:text-[#111827]">
      <Nav user={user} />
      <HeroSection user={user} />
      <ScrollTrackedSection>
        <ProductShowcase />
        <FeaturesSection />
      </ScrollTrackedSection>
      <WorkflowSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
