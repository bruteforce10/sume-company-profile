"use client";

import { useActionState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const labelClass =
  "font-head text-[12px] font-semibold uppercase tracking-wide text-sume-muted";

const inputClass =
  "h-11 w-full rounded-[2px] border border-sume-line bg-white px-3.5 text-sm text-sume-ink outline-none transition placeholder:text-sume-muted/70 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? (
        <Alert
          variant="destructive"
          className="rounded-[2px] border-destructive/30 bg-destructive/5"
        >
          <AlertTitle>{state.error}</AlertTitle>
        </Alert>
      ) : null}

      <input type="hidden" name="redirect" value={redirectTo} />

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="anda@perusahaan.com"
          required
          aria-invalid={Boolean(state.error)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.error)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] bg-sume-blue font-head text-sm font-semibold text-white shadow-[var(--sume-shadow-blue)] transition hover:bg-sume-blue-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Spinner /> : null}
        Masuk
      </button>
    </form>
  );
}
