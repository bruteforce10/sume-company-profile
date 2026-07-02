import { getFormOptions } from "../data";
import { ArticleForm } from "../article-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const { authors, categories, tags } = await getFormOptions();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Blog
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-sume-ink">
          Tulis Artikel
        </h1>
      </header>
      <ArticleForm authors={authors} categories={categories} tags={tags} />
    </div>
  );
}
