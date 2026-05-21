import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProjectCard } from "@/components/project-card";
import { Contact } from "@/components/sections/contact";
import { projects } from "@/constants/site";

export const metadata = {
  title: "Our Project — PT. SUME",
  description: "Completed mechanical and electrical projects by PT. SUME.",
};

const categories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export default function OurProjectPage() {
  return (
    <>
      <Header />
      <main className="bg-sume-bg-contact pt-24 lg:pt-32">
        <section className="section-shell py-16 sm:py-20">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-lg bg-sume-bg-blue-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sume-blue">
              Our Project
            </p>
            <h1 className="font-display text-[42px] font-extrabold leading-tight tracking-[-0.02em] text-sume-ink sm:text-[58px]">
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
                className={`whitespace-nowrap rounded-lg px-5 py-3 text-sm font-bold ${index === 0 ? "bg-sume-blue text-white" : "bg-white text-sume-body"}`}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
        <Contact />
      </main>

      <Footer />
    </>
  );
}
