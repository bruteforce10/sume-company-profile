"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          company: formData.get("company"),
          message: formData.get("message"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message.");
      }

      setStatus("success");
      setStatusMessage(result.message || "Message sent successfully.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="FULL NAME" name="name" placeholder="John Doe" required />
        <Field label="EMAIL ADDRESS" name="email" type="email" placeholder="john@company.com" required />
        <Field label="PHONE NUMBER" name="phone" type="tel" placeholder="+62 ..." />
        <Field label="COMPANY" name="company" placeholder="Your Organization" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MESSAGE</label>
        <textarea id="message" name="message" required rows={5} className="w-full bg-[#E5E7EB] p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-[#D1D5DB]" placeholder="How can we help you?" />
      </div>
      <button type="submit" disabled={status === "loading"} className="mt-2 w-full rounded-md bg-[#0055c3] py-4 text-sm font-bold text-white transition hover:bg-[#00449c] disabled:opacity-50">
        {status === "loading" ? "Sending..." : status === "success" ? "Message Sent" : "Send Inquiry"}
      </button>
      {statusMessage && (
        <p
          className={`text-sm font-semibold ${
            status === "error" ? "text-red-600" : "text-sume-blue"
          }`}
          role="status"
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, type = "text", required = false, placeholder = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="h-12 w-full bg-[#E5E7EB] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-[#D1D5DB]" />
    </div>
  );
}
