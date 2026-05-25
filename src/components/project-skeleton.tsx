type ProjectGridSkeletonProps = {
  count?: number;
  showFilters?: boolean;
};

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);
const skeletonFilters = Array.from({ length: 7 }, (_, index) => index);

export function ProjectGridSkeleton({
  count = 6,
  showFilters = true,
}: ProjectGridSkeletonProps) {
  return (
    <>
      {showFilters && (
        <div className="mt-10 flex gap-3 overflow-hidden pb-2">
          {skeletonFilters.map((item) => (
            <div
              key={item}
              className="h-11 w-24 animate-pulse rounded-lg bg-white"
            />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.slice(0, count).map((item) => (
          <div
            key={item}
            className="min-h-[480px] overflow-hidden rounded-[24px] bg-white shadow-[var(--sume-shadow-image)]"
          >
            <div className="h-full min-h-[480px] animate-pulse bg-gradient-to-br from-slate-200 via-white to-slate-300" />
          </div>
        ))}
      </div>
    </>
  );
}

export function ProjectsPreviewSkeleton() {
  return (
    <section id="projects" className="bg-white py-20 lg:pt-32 lg:pb-24">
      <div className="section-shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-11 w-28 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <ProjectGridSkeleton count={3} showFilters={false} />
      </div>
    </section>
  );
}
