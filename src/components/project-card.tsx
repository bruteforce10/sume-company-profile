"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import type { Project } from "@/constants/site";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const t = useTranslations("Projects");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <article className="min-h-[480px]">
        <button
          type="button"
          className="group relative flex min-h-[480px] w-full cursor-pointer overflow-hidden bg-sume-bg-dark text-left text-white shadow-[var(--sume-shadow-image)] transition-all duration-500 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue"
          onClick={() => setIsOpen(true)}
          aria-label={t("viewDetailAria", { title: project.title })}
        >
          {project.image && (
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-sume-ink via-sume-ink/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

          <div className="relative mt-auto w-full p-8 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="mb-6 inline-flex bg-white/20 px-4 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-md transition-colors group-hover:bg-sume-blue">
              {project.category}
            </div>

            <h3 className="font-display text-[28px] font-extrabold leading-[1.2]">
              {project.title}
            </h3>

            <div className="mt-4 flex items-center gap-2 overflow-hidden">
              <div className="flex items-center gap-2 text-sm font-bold text-sume-blue opacity-0 transition-all duration-500 group-hover:opacity-100">
                {t("learnMore")} <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </button>
      </article>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label={t("closeAria")}
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-[80vw] overflow-hidden bg-transparent"
            onClick={(event) => event.stopPropagation()}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="80vw"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-sume-ink text-white/50">
                {t("noImage")}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
