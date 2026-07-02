import { listTags } from "../data";
import { BlogAdminNav } from "../blog-admin-nav";
import { TAG_FIELDS } from "../taxonomy";
import { TaxonomyManager } from "../taxonomy-manager";
import { deleteTag, saveTag } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await listTags();

  return (
    <div className="flex flex-col gap-7">
      <BlogAdminNav />
      <div className="flex flex-col gap-2">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Konten Situs
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Tag
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          {tags.length} tag. Label lintas kategori untuk menautkan artikel terkait.
        </p>
      </div>

      <TaxonomyManager
        title="Tag"
        singular="tag"
        items={tags}
        fields={TAG_FIELDS}
        saveAction={saveTag}
        deleteAction={deleteTag}
        uploadFolder="tags"
      />
    </div>
  );
}
