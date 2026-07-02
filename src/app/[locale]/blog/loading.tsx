export default function BlogLoading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-3">
        <div className="h-3 w-24 animate-pulse rounded bg-sume-mist" />
        <div className="h-9 w-72 animate-pulse rounded bg-sume-mist" />
      </div>
      <div className="mb-10 aspect-[16/9] w-full animate-pulse rounded-[6px] bg-sume-mist md:aspect-[21/9]" />
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[16/9] w-full animate-pulse rounded bg-sume-mist" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-sume-mist" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-sume-mist" />
            </div>
          ))}
        </div>
        <div className="hidden h-96 animate-pulse rounded bg-sume-mist lg:block" />
      </div>
    </main>
  );
}
