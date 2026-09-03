import { NextResponse, type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { BLOG_BUCKET, blogAssetPath, blogImageSrc } from "@/lib/blog-storage";
import { createClient } from "@/lib/supabase/server";

// Server-side blog-asset upload/delete. Runs the actual Storage calls here (with
// the signed-in admin's cookie session, so the is_admin() RLS policies pass)
// because the self-hosted Supabase is HTTP-only: uploading straight from the
// browser on the deployed HTTPS site is blocked as mixed content. Returns a
// same-origin proxy path (see ../image/[...path]) that loads fine over HTTPS.

// Only these folders are written to (thumbnails, post bodies, author photos,
// category icons). Anything else falls back to "posts".
const ALLOWED_FOLDER = /^[a-z0-9_-]+$/i;

export async function POST(req: NextRequest) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderInput = String(form.get("folder") ?? "posts");
  const folder = ALLOWED_FOLDER.test(folderInput) ? folderInput : "posts";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Hanya berkas gambar yang dapat diunggah." },
      { status: 400 },
    );
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: blogImageSrc(path) });
}

export async function DELETE(req: NextRequest) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const path = blogAssetPath(new URL(req.url).searchParams.get("url"));
  if (!path) return NextResponse.json({ ok: true }); // not one of our uploads — no-op

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BLOG_BUCKET).remove([path]);
  if (error) console.warn(`[blog] gagal menghapus gambar: ${error.message}`);
  return NextResponse.json({ ok: true });
}
