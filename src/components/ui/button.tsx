import type { ButtonHTMLAttributes, ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

const baseButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-lg px-8 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-sume-blue text-white shadow-[var(--sume-shadow-blue)] hover:bg-sume-blue-hover",
  secondary:
    "border border-white/40 bg-white/70 text-sume-ink shadow-[var(--sume-shadow-card)] backdrop-blur-xl hover:bg-white",
  ghost: "text-sume-ink hover:bg-slate-100",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseButtonClass, variants[variant], className)}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(baseButtonClass, variants[variant], className)}
      {...props}
    />
  );
}
