"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";

export type Project = {
  title: string;
  category: string;
  location: string;
  image?: string;
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article 
        className="group relative flex min-h-[480px] cursor-pointer overflow-hidden rounded-[24px] bg-sume-bg-dark text-white shadow-[var(--sume-shadow-image)] transition-all duration-500 hover:shadow-2xl"
        onClick={() => setIsOpen(true)}
      >
        {project.image && (
          <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sume-ink via-sume-ink/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
        
        <div className="relative mt-auto w-full p-8 transition-transform duration-500 group-hover:-translate-y-2">
          <div className="mb-6 inline-flex rounded-md bg-white/20 px-4 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-md transition-colors group-hover:bg-sume-blue group-hover:text-white">
            {project.category}
          </div>
          
          <h3 className="font-display text-[28px] font-extrabold leading-[1.2]">
            {project.title}
          </h3>
            
          <div className="mt-4 flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2 text-sm font-bold text-sume-blue opacity-0 transition-all duration-500 group-hover:opacity-100">
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </article>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all" onClick={() => setIsOpen(false)}>
          <button 
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/30 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          
          <div 
            className="relative h-[80vh] w-full max-w-[80vw] overflow-hidden rounded-2xl bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {project.image ? (
              <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                className="object-contain" 
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-sume-ink text-white/50">
                No detailed image available for this project.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
