import { ProjectCatalog } from "@/components/project-catalog";
import { Contact } from "@/components/sections/contact";
import { getProjects } from "@/lib/projects";

export const metadata = {
  title: "Our Project - PT. SUME",
  description: "Completed mechanical and electrical projects by PT. SUME.",
};

export default async function OurProjectPage() {
  const projects = await getProjects();

  return (
    <main className="bg-sume-bg-contact pt-24 lg:pt-32">
      <section className="section-shell py-16 sm:py-20">
        <div className="max-w-4xl">
          <p className="mb-5 section-eyebrow rounded-lg px-4 py-2 tracking-[0.18em]">
            Our Project
          </p>
          <h1 className="font-display text-[42px] font-extrabold leading-tight text-sume-ink sm:text-[58px]">
            Completed engineering work built for reliability.
          </h1>
          <p className="mt-6 max-w-2xl paper-body">
            Explore selected M&E projects across commercial, industrial,
            hospitality, retail, technology, and public service facilities.
          </p>
        </div>

        <ProjectCatalog projects={projects} />
      </section>
      <Contact />
    </main>
  );
}
