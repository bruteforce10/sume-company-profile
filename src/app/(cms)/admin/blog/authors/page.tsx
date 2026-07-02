import { listAuthors } from "../data";
import { BlogAdminNav } from "../blog-admin-nav";
import { AUTHOR_FIELDS } from "../taxonomy";
import { TaxonomyManager } from "../taxonomy-manager";
import { deleteAuthor, saveAuthor } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  const authors = await listAuthors();

  return (
    <div className="flex flex-col gap-7">
      <BlogAdminNav />
      <div className="flex flex-col gap-2">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Konten Situs
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Penulis
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          {authors.length} penulis. Kelola profil penulis yang muncul di artikel.
        </p>
      </div>

      <TaxonomyManager
        title="Penulis"
        singular="penulis"
        items={authors}
        fields={AUTHOR_FIELDS}
        saveAction={saveAuthor}
        deleteAction={deleteAuthor}
        uploadFolder="authors"
      />
    </div>
  );
}
