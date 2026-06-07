"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { PROJECT_CATEGORIES } from "@/constants/project-categories";
import type { Project } from "@/constants/site";
import { cn } from "@/lib/utils";

const ALL_CATEGORY = "All";

type ProjectCatalogProps = {
  projects: Project[];
};

export function ProjectCatalog({ projects }: ProjectCatalogProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const filteredProjects = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return projects;
    }

    return projects.filter((project) =>
      project.category
        .split(",")
        .map((category) => category.trim().toLowerCase())
        .includes(activeCategory),
    );
  }, [activeCategory, projects]);

  return (
    <>
      <div
        className="mt-10 flex gap-3 overflow-x-auto pb-2"
        aria-label="Project categories"
      >
        {[ALL_CATEGORY, ...PROJECT_CATEGORIES].map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              className={cn(
                "min-h-11 whitespace-nowrap px-5 py-3 text-sm font-bold capitalize transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue",
                isActive
                  ? "bg-sume-blue text-white shadow-[0_10px_24px_rgba(0,94,184,0.24)]"
                  : "bg-white text-sume-body hover:bg-sume-bg-blue-soft hover:text-sume-blue",
              )}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={`${project.title}-${project.category}`}
            project={project}
            priority={index < 3}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="mt-10 rounded-lg border border-sume-line bg-white p-8 text-center text-sm font-semibold text-sume-body">
          No projects found in this category.
        </div>
      )}
    </>
  );
}
