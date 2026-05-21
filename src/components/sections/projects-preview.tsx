import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/constants/site";

export function ProjectsPreview() {
  return (
    <section id="projects" className="bg-white py-20 lg:pt-32 lg:pb-24">
      <div className="section-shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="paper-heading">Our Completed Projects</h2>
          <Link
            href="/our-project"
            className="inline-flex min-h-11 items-center text-sm font-bold text-sume-blue transition hover:text-sume-blue-hover"
          >
            View All Projects
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
