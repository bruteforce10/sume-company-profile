import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { formatDate } from "@/lib/blog-utils";
import { togglePublish } from "./actions";
import { BlogAdminNav } from "./blog-admin-nav";
import { listAdminPosts, type AdminPostRow } from "./data";
import { DeletePostButton } from "./delete-post-button";

export const dynamic = "force-dynamic";

function statusOf(post: AdminPostRow): { label: string; cls: string } {
  if (post.is_draft) return { label: "Draf", cls: "bg-amber-100 text-amber-700" };
  if (post.scheduled_at && new Date(post.scheduled_at) > new Date()) {
    return { label: "Terjadwal", cls: "bg-blue-100 text-blue-700" };
  }
  return { label: "Terbit", cls: "bg-emerald-100 text-emerald-700" };
}

export default async function AdminBlogPage() {
  const posts = await listAdminPosts();

  return (
    <div className="flex flex-col gap-7">
      <BlogAdminNav />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
            Konten Situs
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
            Blog
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
            {posts.length} artikel. Kelola, terbitkan, dan jadwalkan artikel blog.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[2px] bg-sume-blue px-4 font-head text-sm font-semibold text-white transition hover:bg-sume-blue-hover"
        >
          <PlusIcon className="size-4" /> Tulis Artikel
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[3px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
          Belum ada artikel. Mulai dengan menulis artikel pertama.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[3px] border border-sume-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sume-line bg-sume-mist/50 text-[12px] uppercase tracking-wide text-sume-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sume-line/70">
              {posts.map((post) => {
                const status = statusOf(post);
                return (
                  <tr key={post.id} className="hover:bg-sume-mist/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="font-semibold text-sume-ink hover:text-sume-blue"
                      >
                        {post.title}
                      </Link>
                      {post.featured ? (
                        <span className="ml-2 rounded-full bg-sume-bg-blue-soft px-1.5 py-0.5 text-[10px] font-semibold text-sume-blue">
                          Unggulan
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sume-body">{post.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sume-muted">
                      {formatDate(post.published_at ?? post.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={togglePublish}>
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="rounded-[2px] border border-sume-line px-2.5 py-1 text-[12px] font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue"
                          >
                            {post.is_draft ? "Terbitkan" : "Jadikan draf"}
                          </button>
                        </form>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="rounded-[2px] border border-sume-line px-2.5 py-1 text-[12px] font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue"
                        >
                          Edit
                        </Link>
                        <DeletePostButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
