import { listCategories } from "../data";
import { BlogAdminNav } from "../blog-admin-nav";
import { CATEGORY_FIELDS } from "../taxonomy";
import { TaxonomyManager } from "../taxonomy-manager";
import { deleteCategory, saveCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="flex flex-col gap-7">
      <BlogAdminNav />
      <div className="flex flex-col gap-2">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Konten Situs
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Kategori
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          {categories.length} kategori. Digunakan untuk mengelompokkan artikel.
        </p>
      </div>

      <TaxonomyManager
        title="Kategori"
        singular="kategori"
        items={categories}
        fields={CATEGORY_FIELDS}
        saveAction={saveCategory}
        deleteAction={deleteCategory}
        uploadFolder="categories"
      />
    </div>
  );
}
