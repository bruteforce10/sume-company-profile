import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BusinessSolutions } from "@/components/sections/business-solutions";
import { Clients } from "@/components/sections/clients";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { ProjectsPreviewSkeleton } from "@/components/project-skeleton";
import { WhyChooseUs } from "@/components/sections/why-choose-us";

export default function Home() {
  return (
    <main>
      <Hero />
      <Clients />
      <About />
      <BusinessSolutions />
      <WhyChooseUs />
      <Suspense fallback={<ProjectsPreviewSkeleton />}>
        <ProjectsPreview />
      </Suspense>
      <Process />
      <Contact />
    </main>
  );
}
