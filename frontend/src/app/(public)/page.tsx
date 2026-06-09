import React from 'react';
import Hero from "@/components/sections/Hero";
import DualEntryCards from "@/components/sections/DualEntryCards";
import ServiceBentoGrid from "@/components/sections/ServiceBentoGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import RepairsTracker from "@/components/sections/RepairsTracker";

export default function Home() {
  return (
    <div className="space-y-20 pb-24">
      <Hero />
      <DualEntryCards />
      <ServiceBentoGrid />
      <FeaturedProducts />
      <RepairsTracker />
    </div>
  );
}
