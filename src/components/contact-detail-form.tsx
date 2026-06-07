"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const facilityOptions = [
  { value: "data-center", label: "Data Center" },
  { value: "commercial", label: "Commercial Building" },
  { value: "industrial", label: "Industrial Facility" },
  { value: "other", label: "Other" },
];

const fieldClass =
  "w-full appearance-none rounded-[2px] border-[1.5px] border-sume-line bg-white px-4 py-[13px] font-body text-[15.5px] text-sume-ink outline-none transition placeholder:text-sume-line focus:border-sume-blue focus:shadow-[0_0_0_3px_rgba(0,88,190,0.1)]";

const labelClass =
  "font-head text-[13px] font-semibold uppercase tracking-[0.06em] text-sume-body";

function getValue(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

export function ContactDetailForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const facilityValue = getValue(data, "facility");
    const facilityLabel =
      facilityOptions.find((option) => option.value === facilityValue)?.label ??
      facilityValue;
    const baseMessage = getValue(data, "message");
    const message = facilityLabel
      ? `Facility type: ${facilityLabel}\n\n${baseMessage}`
      : baseMessage;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: getValue(data, "name"),
          company: getValue(data, "company"),
          email: getValue(data, "email"),
          message,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.",
      );
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="cd-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="cd-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="cd-company" className={labelClass}>
            Company
          </label>
          <input
            id="cd-company"
            name="company"
            type="text"
            required
            placeholder="Your company"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="cd-email" className={labelClass}>
          Email Address
        </label>
        <input
          id="cd-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="cd-facility" className={labelClass}>
          Facility Type
        </label>
        <div className="relative">
          <select
            id="cd-facility"
            name="facility"
            required
            defaultValue=""
            className={`${fieldClass} cursor-pointer pr-10`}
          >
            <option value="" disabled>
              Select facility type
            </option>
            {facilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sume-muted" />
        </div>
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="cd-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="cd-message"
          name="message"
          required
          rows={5}
          placeholder="Describe your requirements — scope, location, timeline…"
          className={`${fieldClass} min-h-[130px] resize-y leading-[1.6]`}
        />
      </div>

      <p className="text-[13.5px] leading-[1.5] text-sume-muted">
        By submitting this form, you agree to our{" "}
        <a
          href="#"
          className="border-b border-transparent text-sume-blue transition hover:border-sume-blue"
        >
          Privacy Policy
        </a>
        . We will not share your information with third parties.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-3.5 rounded-[2px] border-[1.5px] border-sume-blue bg-sume-accent px-[22px] py-[18px] font-head text-[15px] font-semibold text-sume-blue">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px] flex-none stroke-sume-blue"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
          Thank you — we&apos;ll be in touch within one business day.
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === "loading"}
          className="sume-btn sume-btn-primary w-full justify-center py-[17px] text-[16px] disabled:opacity-60"
        >
          {status === "loading" ? (
            "Sending…"
          ) : (
            <>
              Request a Consultation
              <ArrowRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      )}

      {status === "error" ? (
        <p className="text-sm font-semibold text-red-600" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}
