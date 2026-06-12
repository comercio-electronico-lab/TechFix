import React from 'react';
import Hero from "@/components/sections/Hero";
import DualEntryCards from "@/components/sections/DualEntryCards";
import ServiceBentoGrid from "@/components/sections/ServiceBentoGrid";
import FeaturedProductShowcase from "@/components/sections/FeaturedProductShowcase";
import RepairsTracker from "@/components/sections/RepairsTracker";

export default function Home() {
  return (
    <div className="pb-24">
      <Hero />
      <div className="mt-8 md:mt-12">
        <DualEntryCards />
      </div>
      <ServiceBentoGrid />
      <FeaturedProductShowcase />
      <div className="mt-20 md:mt-24">
        <RepairsTracker />
      </div>
    </div>
  );
}

