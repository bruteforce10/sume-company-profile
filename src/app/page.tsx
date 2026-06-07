import { ClosingCta } from "@/components/sections/closing-cta";
import { DataCenterTeaser } from "@/components/sections/data-center-teaser";
import { Hero } from "@/components/sections/hero";
import { PositioningStrip } from "@/components/sections/positioning-strip";
import { SolutionsOverview } from "@/components/sections/solutions-overview";
import { TrustedBy } from "@/components/sections/trusted-by";
import { WhySume } from "@/components/sections/why-sume";

export default function Home() {
  return (
    <main className="font-body">
      <Hero />
      <PositioningStrip />
      <SolutionsOverview />
      <DataCenterTeaser />
      <WhySume />
      <TrustedBy />
      <ClosingCta />
    </main>
  );
}
