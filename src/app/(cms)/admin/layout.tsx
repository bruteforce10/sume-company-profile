import type { ReactNode } from "react";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../login/actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Authoritative admin check for the whole /admin subtree.
  const { claims } = await requireAdmin();
  const email = typeof claims?.email === "string" ? claims.email : "";
  const initials = (email.slice(0, 2) || "AD").toUpperCase();

  return (
    <div className="min-h-svh bg-sume-bg-page">
      <header className="sticky top-0 z-30 border-b border-sume-line bg-white/90 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-[11px]">
            <Image
              src="/images/home/sume-logo.png"
              alt="SUME"
              width={1745}
              height={431}
              priority
              className="h-6 w-auto"
            />
            <span className="border-l border-sume-line pl-[11px] font-head text-[12px] font-semibold uppercase tracking-[0.2em] text-sume-muted">
              CMS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[13px] text-sume-muted sm:inline">
              {email}
            </span>
            <span
              className="inline-flex size-9 items-center justify-center rounded-[3px] bg-sume-bg-blue-soft font-head text-[12px] font-semibold text-sume-blue"
              aria-hidden
            >
              {initials}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-sume-line bg-white px-3.5 font-head text-[13px] font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue"
              >
                <LogOutIcon className="size-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">{children}</main>
    </div>
  );
}
