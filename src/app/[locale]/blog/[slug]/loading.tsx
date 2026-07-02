export default function ArticleLoading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="h-3 w-56 animate-pulse rounded bg-sume-mist" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <div className="h-3 w-28 animate-pulse rounded bg-sume-mist" />
          <div className="h-10 w-full animate-pulse rounded bg-sume-mist" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-sume-mist" />
          <div className="mt-2 aspect-[16/9] w-full animate-pulse rounded-[6px] bg-sume-mist" />
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-sume-mist" />
            ))}
          </div>
        </div>
        <div className="hidden h-96 animate-pulse rounded bg-sume-mist lg:block" />
      </div>
    </main>
  );
}
