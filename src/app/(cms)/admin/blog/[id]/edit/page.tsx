import { notFound } from "next/navigation";
import { getAdminPost, getFormOptions } from "../../data";
import { ArticleForm } from "../../article-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, options] = await Promise.all([getAdminPost(id), getFormOptions()]);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Blog
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-sume-ink">
          Edit Artikel
        </h1>
      </header>
      <ArticleForm
        authors={options.authors}
        categories={options.categories}
        tags={options.tags}
        post={post}
      />
    </div>
  );
}
