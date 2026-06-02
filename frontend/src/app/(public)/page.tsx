import Hero from "@/components/sections/Hero";
import ServiceBentoGrid from "@/components/sections/ServiceBentoGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import StatusCTA from "@/components/sections/StatusCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceBentoGrid />
      <FeaturedProducts />
      <StatusCTA />
    </>
  );
}

