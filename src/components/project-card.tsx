import { ArrowUpRight } from "lucide-react";

export type Project = {
  title: string;
  category: string;
  description: string;
  location: string;
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group relative flex min-h-[480px] overflow-hidden rounded-[24px] bg-sume-bg-dark text-white shadow-[var(--sume-shadow-image)]">
      <div className={`absolute inset-0 bg-[image:var(--sume-project-surface)] ${index % 2 === 1 ? "hue-rotate-15" : ""}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-sume-ink via-sume-ink/45 to-transparent" />
      <div className="relative mt-auto w-full p-8">
        <div className="mb-4 inline-flex rounded-md bg-white/85 px-3 py-1 text-xs font-bold text-sume-blue backdrop-blur">{project.category}</div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[24px] font-extrabold leading-8">{project.title}</h3>
            <p className="mt-2 max-w-[283px] text-sm leading-5 text-white/85">{project.description}</p>
          </div>
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white/85 text-sume-blue transition group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </article>
  );
}
