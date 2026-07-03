"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon, SaveIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { BlogEditor } from "@/components/blog/blog-editor";
import { Spinner } from "@/components/ui/spinner";
import { deleteBlogImage, uploadBlogImage } from "@/lib/blog-upload";
import type { BlogAuthor, BlogCategory, BlogPostDetail, BlogTag } from "@/lib/blog-types";
import { cn } from "@/lib/utils";
import { createPost, updatePost, type PostActionState } from "./actions";

const initialState: PostActionState = { ok: false, error: null, ts: 0 };

const fieldClass =
  "w-full rounded-[2px] border border-sume-line bg-white px-3 py-2 text-sm text-sume-ink outline-none transition placeholder:text-sume-muted/60 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/15";
const labelClass = "text-[12.5px] font-semibold text-sume-ink";
const cardClass = "flex flex-col gap-4 rounded-[3px] border border-sume-line bg-white p-4";

type LinkRow = { label: string; url: string };

// ISO → value for <input type="datetime-local"> (local time, no timezone).
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type ArticleFormProps = {
  authors: BlogAuthor[];
  categories: BlogCategory[];
  tags: BlogTag[];
  post?: BlogPostDetail | null;
};

export function ArticleForm({ authors, categories, tags, post }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(
    post ? updatePost : createPost,
    initialState,
  );

  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? "");
  const [thumbUploading, setThumbUploading] = useState(false);
  // URLs uploaded during THIS form session. Safe to delete from Storage the
  // moment they're discarded (they were never persisted). The already-saved
  // thumbnail is cleaned up server-side on save instead, so removing it here and
  // then abandoning the form can never break a live post.
  const sessionUploads = useRef<Set<string>>(new Set());

  function discardIfSessionUpload(url: string) {
    if (url && sessionUploads.current.has(url)) {
      sessionUploads.current.delete(url);
      void deleteBlogImage(url);
    }
  }
  const [links, setLinks] = useState<LinkRow[]>(post?.internal_links ?? []);
  const selectedTagIds = new Set((post?.tags ?? []).map((t) => t.id));

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) toast.success("Artikel tersimpan.");
    else if (state.error) toast.error(state.error);
  }, [state.ts, state.ok, state.error]);

  async function onPickThumbnail(file: File) {
    const previous = thumbnail;
    setThumbUploading(true);
    try {
      const url = await uploadBlogImage(file, "thumbnails");
      sessionUploads.current.add(url);
      setThumbnail(url);
      discardIfSessionUpload(previous); // free the replaced file if it was ours this session
    } catch (error) {
      toast.error(
        `Gagal mengunggah: ${error instanceof Error ? error.message : "kesalahan tak terduga"}`,
      );
    } finally {
      setThumbUploading(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <input type="hidden" name="internalLinks" value={JSON.stringify(links)} />

      {/* ── Main column ─────────────────────────────────────────── */}
      {/* min-w-0 lets this 1fr grid track shrink below its content width, so a
          long unbreakable string in the editor wraps instead of stretching the form. */}
      <div className="flex min-w-0 flex-col gap-5">
        <div className={cardClass}>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="title">
              Judul/Meta Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={post?.title ?? ""}
              placeholder="Judul artikel"
              className={cn(fieldClass, "text-base font-semibold")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={post?.slug ?? ""}
              placeholder="otomatis dibuat dari judul"
              className={cn(fieldClass, "font-mono text-[13px]")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="excerpt">
              Ringkasan/Meta Description
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
              placeholder="Ringkasan singkat untuk kartu & pratinjau"
              className={cn(fieldClass, "field-sizing-content")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Konten</label>
          <BlogEditor
            name="content"
            defaultValue={post?.content ?? ""}
            aria-label="Konten artikel"
            savedSignal={state.ok ? state.ts : 0}
          />
        </div>

        {/* Internal links */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <span className={labelClass}>Tautan internal</span>
            <button
              type="button"
              onClick={() => setLinks((p) => [...p, { label: "", url: "" }])}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-sume-blue hover:text-sume-blue-hover"
            >
              <PlusIcon className="size-3.5" /> Tambah
            </button>
          </div>
          {links.length === 0 ? (
            <p className="text-[13px] text-sume-muted">Belum ada tautan internal.</p>
          ) : (
            links.map((link, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  aria-label="Label tautan"
                  value={link.label}
                  onChange={(e) =>
                    setLinks((p) => p.map((l, idx) => (idx === i ? { ...l, label: e.target.value } : l)))
                  }
                  placeholder="Label"
                  className={fieldClass}
                />
                <input
                  aria-label="URL tautan"
                  value={link.url}
                  onChange={(e) =>
                    setLinks((p) => p.map((l, idx) => (idx === i ? { ...l, url: e.target.value } : l)))
                  }
                  placeholder="/blog/… atau https://…"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => setLinks((p) => p.filter((_, idx) => idx !== i))}
                  aria-label="Hapus tautan"
                  className="flex h-9 w-9 items-center justify-center rounded-[2px] text-sume-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Sidebar column ──────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className={cardClass}>
          <span className={labelClass}>Publikasi</span>
          <label className="flex items-center gap-2 text-sm text-sume-body">
            <input
              type="checkbox"
              name="isDraft"
              defaultChecked={post ? post.is_draft : true}
              className="size-4 accent-sume-blue"
            />
            Simpan sebagai draf
          </label>
          <label className="flex items-center gap-2 text-sm text-sume-body">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={post?.featured ?? false}
              className="size-4 accent-sume-blue"
            />
            Tandai sebagai unggulan
          </label>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="scheduledAt">
              Jadwal terbit (opsional)
            </label>
            <input
              id="scheduledAt"
              type="datetime-local"
              name="scheduledAt"
              defaultValue={toLocalInput(post?.scheduled_at ?? null)}
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={pending || thumbUploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-sume-blue px-5 font-head text-sm font-semibold text-white transition hover:bg-sume-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? <Spinner className="size-4" /> : <SaveIcon className="size-4" />}
            Simpan
          </button>
          {post ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-center text-[13px] font-semibold text-sume-blue hover:underline"
            >
              Lihat di situs ↗
            </Link>
          ) : null}
        </div>

        <div className={cardClass}>
          <span className={labelClass}>Thumbnail</span>
          {thumbnail ? (
            <div className="relative overflow-hidden rounded-[2px] border border-sume-line">
              <Image
                src={thumbnail}
                alt="Pratinjau thumbnail"
                width={320}
                height={180}
                className="h-auto w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  discardIfSessionUpload(thumbnail);
                  setThumbnail("");
                }}
                aria-label="Hapus thumbnail"
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ) : null}
          <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-sume-line bg-white px-3 text-[13px] font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue">
            {thumbUploading ? <Spinner className="size-4" /> : <UploadIcon className="size-4" />}
            {thumbnail ? "Ganti gambar" : "Unggah gambar"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onPickThumbnail(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className={cardClass}>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="categoryId">
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={post?.category_id ?? ""}
              className={fieldClass}
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="authorId">
              Penulis
            </label>
            <select
              id="authorId"
              name="authorId"
              defaultValue={post?.author_id ?? ""}
              className={fieldClass}
            >
              <option value="">— Pilih penulis —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className={labelClass}>Tag</span>
            <div className="flex flex-wrap gap-1.5">
              {tags.length === 0 ? (
                <p className="text-[13px] text-sume-muted">Belum ada tag.</p>
              ) : (
                tags.map((t) => (
                  <label
                    key={t.id}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-sume-line px-2.5 py-1 text-[13px] text-sume-body transition has-checked:border-sume-blue has-checked:bg-sume-bg-blue-soft has-checked:text-sume-blue"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={t.id}
                      defaultChecked={selectedTagIds.has(t.id)}
                      className="size-3.5 accent-sume-blue"
                    />
                    {t.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
