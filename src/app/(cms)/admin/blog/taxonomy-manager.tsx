"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PencilIcon, PlusIcon, SaveIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { deleteBlogImage, uploadBlogImage } from "@/lib/blog-upload";
import { cn } from "@/lib/utils";
import type { TaxActionState, TaxFieldDef, TaxItem } from "./taxonomy";

const initialState: TaxActionState = { ok: false, error: null, ts: 0 };

const fieldClass =
  "w-full rounded-[2px] border border-sume-line bg-white px-3 py-2 text-sm text-sume-ink outline-none transition placeholder:text-sume-muted/60 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/15";
const labelClass = "text-[12.5px] font-semibold text-sume-ink";
const cardClass = "flex flex-col gap-4 rounded-[3px] border border-sume-line bg-white p-4";

type ManagerProps = {
  /** Section label, e.g. "Penulis". */
  title: string;
  /** Lowercase singular used in prompts, e.g. "penulis". */
  singular: string;
  items: TaxItem[];
  fields: TaxFieldDef[];
  /** Server action: creates (empty id) or updates (present id) a row. */
  saveAction: (prev: TaxActionState, formData: FormData) => Promise<TaxActionState>;
  /** Server action: deletes a row by id. */
  deleteAction: (formData: FormData) => Promise<void>;
  /** Storage sub-folder for image uploads (e.g. "authors"). */
  uploadFolder: string;
};

export function TaxonomyManager({
  title,
  singular,
  items,
  fields,
  saveAction,
  deleteAction,
  uploadFolder,
}: ManagerProps) {
  const [state, formAction, pending] = useActionState(saveAction, initialState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  // Images uploaded this session are safe to delete from Storage the instant
  // they're discarded (never persisted). Persisted images loaded via startEdit
  // are never tracked here, so they're only freed server-side on save/delete.
  const sessionUploads = useRef<Set<string>>(new Set());

  function discardIfSessionUpload(url: string) {
    if (url && sessionUploads.current.has(url)) {
      sessionUploads.current.delete(url);
      void deleteBlogImage(url);
    }
  }

  const editing = editingId ? (items.find((i) => i.id === editingId) ?? null) : null;
  const imageFields = fields.filter((f) => f.type === "image");

  // Reset the form after a successful save. Done during render (React's "adjust
  // state when a value changes" pattern) rather than in an effect, to avoid a
  // cascading setState-in-effect. Converges because handledTs catches up to state.ts.
  const [handledTs, setHandledTs] = useState(0);
  if (state.ok && state.ts !== handledTs) {
    setHandledTs(state.ts);
    setEditingId(null);
    setImages({});
    setFormKey((k) => k + 1);
  }

  // Toasts are an external side effect, so they belong in an effect.
  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) toast.success(`${title} tersimpan.`);
    else if (state.error) toast.error(state.error);
  }, [state.ts, state.ok, state.error, title]);

  function startEdit(item: TaxItem) {
    setEditingId(item.id);
    const next: Record<string, string> = {};
    for (const f of imageFields) next[f.name] = String(item[f.name] ?? "");
    setImages(next);
    setFormKey((k) => k + 1);
  }

  function cancelEdit() {
    setEditingId(null);
    setImages({});
    setFormKey((k) => k + 1);
  }

  async function onPickImage(field: string, file: File) {
    const previous = images[field] ?? "";
    setUploadingField(field);
    try {
      const url = await uploadBlogImage(file, uploadFolder);
      sessionUploads.current.add(url);
      setImages((p) => ({ ...p, [field]: url }));
      discardIfSessionUpload(previous);
    } catch (error) {
      toast.error(
        `Gagal mengunggah: ${error instanceof Error ? error.message : "kesalahan tak terduga"}`,
      );
    } finally {
      setUploadingField(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* ── List ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="rounded-[3px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
            Belum ada {singular}. Tambahkan lewat formulir di samping.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[3px] border border-sume-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-sume-line bg-sume-mist/50 text-[12px] uppercase tracking-wide text-sume-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sume-line/70">
                {items.map((item) => {
                  const thumb = imageFields
                    .map((f) => String(item[f.name] ?? ""))
                    .find((v) => v !== "");
                  return (
                    <tr key={item.id} className="hover:bg-sume-mist/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt=""
                              width={32}
                              height={32}
                              className="size-8 shrink-0 rounded-full object-cover"
                            />
                          ) : null}
                          <span className="font-semibold text-sume-ink">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12.5px] text-sume-muted">{item.slug}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-[2px] border px-2.5 py-1 text-[12px] font-semibold transition",
                              editingId === item.id
                                ? "border-sume-blue bg-sume-bg-blue-soft text-sume-blue"
                                : "border-sume-line text-sume-navy hover:border-sume-blue hover:text-sume-blue",
                            )}
                          >
                            <PencilIcon className="size-3.5" /> Edit
                          </button>
                          <form
                            action={deleteAction}
                            onSubmit={(e) => {
                              if (!window.confirm(`Hapus ${singular} “${item.name}”?`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              aria-label={`Hapus ${singular}`}
                              title="Hapus"
                              className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-sume-line text-sume-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2Icon className="size-3.5" />
                            </button>
                          </form>
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

      {/* ── Create / edit form ──────────────────────────────────── */}
      <form key={formKey} action={formAction} className={cn(cardClass, "h-fit lg:sticky lg:top-24")}>
        <div className="flex items-center justify-between">
          <span className="font-head text-sm font-bold text-sume-ink">
            {editingId ? `Edit ${singular}` : `Tambah ${singular}`}
          </span>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-sume-muted hover:text-sume-ink"
            >
              <XIcon className="size-3.5" /> Batal
            </button>
          ) : null}
        </div>

        <input type="hidden" name="id" value={editingId ?? ""} />

        {fields.map((f) => {
          if (f.type === "image") {
            const val = images[f.name] ?? "";
            return (
              <div key={f.name} className="flex flex-col gap-1.5">
                <span className={labelClass}>{f.label}</span>
                <input type="hidden" name={f.name} value={val} />
                {val ? (
                  <div className="relative w-fit overflow-hidden rounded-[2px] border border-sume-line">
                    <Image
                      src={val}
                      alt={`Pratinjau ${f.label}`}
                      width={96}
                      height={96}
                      className="size-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        discardIfSessionUpload(images[f.name] ?? "");
                        setImages((p) => ({ ...p, [f.name]: "" }));
                      }}
                      aria-label={`Hapus ${f.label}`}
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                ) : null}
                <label className="inline-flex h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-sume-line bg-white px-3 text-[13px] font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue">
                  {uploadingField === f.name ? (
                    <Spinner className="size-4" />
                  ) : (
                    <UploadIcon className="size-4" />
                  )}
                  {val ? "Ganti gambar" : "Unggah gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onPickImage(f.name, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            );
          }

          const defaultValue = String(editing?.[f.name] ?? "");
          return (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor={`tax-${f.name}`}>
                {f.label}
                {f.required ? <span className="text-red-500"> *</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`tax-${f.name}`}
                  name={f.name}
                  rows={3}
                  required={f.required}
                  defaultValue={defaultValue}
                  placeholder={f.placeholder}
                  className={cn(fieldClass, "field-sizing-content")}
                />
              ) : (
                <input
                  id={`tax-${f.name}`}
                  name={f.name}
                  type={f.type === "url" ? "url" : "text"}
                  required={f.required}
                  defaultValue={defaultValue}
                  placeholder={f.placeholder}
                  className={cn(fieldClass, f.name === "slug" && "font-mono text-[13px]")}
                />
              )}
              {f.helper ? <span className="text-[11.5px] text-sume-muted">{f.helper}</span> : null}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={pending || uploadingField !== null}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-sume-blue px-5 font-head text-sm font-semibold text-white transition hover:bg-sume-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <Spinner className="size-4" />
          ) : editingId ? (
            <SaveIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          {editingId ? "Simpan" : "Tambah"}
        </button>
      </form>
    </div>
  );
}
