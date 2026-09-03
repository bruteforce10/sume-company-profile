import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

// Records a single article view. Moved off the browser (it used to call the RPC
// directly via the anon client) because the self-hosted Supabase is HTTP-only,
// so that call was silently blocked as mixed content on the deployed HTTPS site.
// The RPC is SECURITY DEFINER and safely no-ops for drafts/unknown slugs.
export async function POST(req: NextRequest) {
  const { slug } = await req.json().catch(() => ({ slug: null }));
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createPublicClient();
  await supabase.rpc("record_post_view", { p_slug: slug });
  return NextResponse.json({ ok: true });
}
