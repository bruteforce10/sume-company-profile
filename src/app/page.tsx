import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { About } from "@/components/sections/about";
import { BusinessSolutions } from "@/components/sections/business-solutions";
import { Clients } from "@/components/sections/clients";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { WhyChooseUs } from "@/components/sections/why-choose-us";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Clients />
        <About />
        <BusinessSolutions />
        <WhyChooseUs />
        <ProjectsPreview />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
