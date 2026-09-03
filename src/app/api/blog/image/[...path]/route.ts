import { type NextRequest } from "next/server";
import { BLOG_BUCKET } from "@/lib/blog-storage";

// Streams a public blog-assets object from the (HTTP-only, self-hosted) Supabase
// Storage through this app's own HTTPS origin, so blog images load on the
// deployed site without tripping the browser's mixed-content block. The bucket
// is public-read, so no auth is required; we only ever proxy this one bucket.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  // Segments can't contain "/", but reject traversal attempts defensively.
  if (path.some((seg) => seg === "..")) {
    return new Response("Not found", { status: 404 });
  }

  const objectPath = path.map(encodeURIComponent).join("/");
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const upstream = `${base}/storage/v1/object/public/${BLOG_BUCKET}/${objectPath}`;

  const res = await fetch(upstream, { cache: "no-store" });
  if (!res.ok || !res.body) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  const contentType = res.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  // Objects are content-addressed (random UUID names), so they never change.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(res.body, { status: 200, headers });
}
