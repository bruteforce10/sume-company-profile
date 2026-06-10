import { Contact } from "@/components/sections/contact";
import { ProjectGridSkeleton } from "@/components/project-skeleton";

export default function Loading() {
  return (
    <main className="bg-sume-bg-contact pt-24 lg:pt-32">
      <section className="section-shell py-16 sm:py-20">
        <div className="max-w-4xl">
          <div className="mb-5 h-10 w-36 animate-pulse rounded-lg bg-white" />
          <div className="h-24 max-w-3xl animate-pulse rounded-lg bg-white sm:h-36" />
          <div className="mt-6 h-20 max-w-2xl animate-pulse rounded-lg bg-white" />
        </div>

        <ProjectGridSkeleton />
      </section>
      <Contact />
    </main>
  );
}
