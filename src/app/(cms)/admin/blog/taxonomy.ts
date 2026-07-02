// Shared, dependency-free descriptors for the taxonomy CRUD screens (authors,
// categories, tags). Pure data + types only — no client/server imports — so it can
// be imported by both the client manager component and the server actions.

export type TaxFieldType = "text" | "textarea" | "url" | "image";

export type TaxFieldDef = {
  name: string;
  label: string;
  type: TaxFieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
};

// Every taxonomy has a name + slug; slug is optional (auto-derived from name when
// left blank, server-side via slugify).
const NAME: TaxFieldDef = { name: "name", label: "Nama", type: "text", required: true, placeholder: "Nama" };
const SLUG: TaxFieldDef = {
  name: "slug",
  label: "Slug",
  type: "text",
  placeholder: "otomatis dari nama",
  helper: "Biarkan kosong untuk membuat otomatis dari nama.",
};

export const AUTHOR_FIELDS: TaxFieldDef[] = [
  NAME,
  SLUG,
  { name: "photo", label: "Foto", type: "image" },
  { name: "bio", label: "Bio", type: "textarea", placeholder: "Deskripsi singkat penulis" },
  { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/…" },
  { name: "email", label: "Email", type: "text", placeholder: "nama@contoh.com" },
];

export const CATEGORY_FIELDS: TaxFieldDef[] = [
  NAME,
  SLUG,
  { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi kategori" },
  { name: "icon", label: "Ikon", type: "image" },
];

export const TAG_FIELDS: TaxFieldDef[] = [NAME, SLUG];

export type TaxActionState = { ok: boolean; error: string | null; ts: number };

/** Row shape the manager renders in its list — every taxonomy exposes id/name/slug. */
export type TaxItem = { id: string; name: string; slug: string } & Record<string, unknown>;
