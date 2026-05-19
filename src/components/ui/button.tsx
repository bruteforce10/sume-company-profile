import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-sume-blue text-white shadow-[var(--sume-shadow-blue)] hover:bg-sume-blue-hover",
  secondary: "border border-white/40 bg-white/70 text-sume-ink shadow-[var(--sume-shadow-card)] backdrop-blur-xl hover:bg-white",
  ghost: "text-sume-ink hover:bg-slate-100",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-lg px-8 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({ className, variant = "primary", href, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-lg px-8 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
