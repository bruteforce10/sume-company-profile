import { ProjectCard } from "@/components/project-card";
import { Contact } from "@/components/sections/contact";
import { projects } from "@/constants/site";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Our Project - PT. SUME",
  description: "Completed mechanical and electrical projects by PT. SUME.",
};

const categories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export default function OurProjectPage() {
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

        <div
          className="mt-10 flex gap-3 overflow-x-auto pb-2"
          aria-label="Project categories"
        >
          {categories.map((category, index) => (
            <span
              key={category}
              className={cn(
                "whitespace-nowrap rounded-lg px-5 py-3 text-sm font-bold",
                index === 0
                  ? "bg-sume-blue text-white"
                  : "bg-white text-sume-body",
              )}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
      <Contact />
    </main>
  );
}
