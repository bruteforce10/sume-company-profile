import { ShieldAlertIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthContext } from "@/lib/auth";
import { signOut } from "./actions";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  const { claims, isAdmin } = await getAuthContext();

  // Already an admin → straight to the editor.
  if (isAdmin) redirect("/admin/messages");

  // Signed in but not an admin: offer to sign out instead of looping.
  const forbidden = Boolean(claims) && !isAdmin;
  const target = redirectTo?.startsWith("/admin") ? redirectTo : "/admin/messages";

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-12">
      {/* Engineering-grid backdrop + soft blue glow, echoing the marketing site. */}
      <div
        className="engineering-grid pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 right-[-12%] h-[460px] w-[460px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--sume-blue) 18%, transparent), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/home/sume-logo.png"
            alt="SUME"
            width={1745}
            height={431}
            priority
            className="h-7 w-auto"
          />
          <span className="font-head text-[12px] font-semibold uppercase tracking-[0.22em] text-sume-muted">
            Content Management
          </span>
        </div>

        <div className="rounded-[4px] border border-sume-line bg-white px-7 py-8 shadow-[0_30px_80px_-40px_rgba(14,36,60,0.45)]">
          <div className="mb-6 flex flex-col gap-1.5">
            <h1 className="font-display text-[22px] font-extrabold tracking-tight text-sume-ink">
              {forbidden ? "Akses ditolak" : "Masuk ke CMS"}
            </h1>
            <p className="text-[14px] leading-relaxed text-sume-body">
              {forbidden
                ? "Akun ini tidak memiliki akses admin."
                : "Masuk untuk mengelola konten situs."}
            </p>
          </div>

          {forbidden ? (
            <div className="flex flex-col gap-4">
              <Alert
                variant="destructive"
                className="rounded-[2px] border-destructive/30 bg-destructive/5"
              >
                <ShieldAlertIcon />
                <AlertTitle>Butuh izin admin</AlertTitle>
                <AlertDescription>
                  Hubungi administrator untuk meminta akses, atau masuk dengan
                  akun lain.
                </AlertDescription>
              </Alert>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-[2px] border border-sume-line bg-white font-head text-sm font-semibold text-sume-navy transition hover:border-sume-blue hover:text-sume-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue"
                >
                  Keluar
                </button>
              </form>
            </div>
          ) : (
            <LoginForm redirectTo={target} />
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-sume-muted">
          &copy; {new Date().getFullYear()} SUME Group &middot; Area khusus admin.
        </p>
      </div>
    </main>
  );
}
