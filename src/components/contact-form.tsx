"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 700);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Subject" name="subject" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-bold text-slate-800">Message <span className="text-cyan-700">*</span></label>
        <textarea id="message" name="message" required rows={6} className="min-h-36 rounded-lg border border-sume-line/60 bg-white px-4 py-3 text-base outline-none transition focus:border-sume-blue focus:bg-white focus:ring-4 focus:ring-sume-blue/10" placeholder="Tell us about your project needs" />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full rounded-2xl">
        {status === "loading" ? "Sending..." : status === "success" ? "Message Prepared" : "Send Message"}
      </Button>
      {status === "success" && <p className="text-sm font-semibold text-sume-blue" role="status">Frontend demo ready. Email integration comes next.</p>}
    </form>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-bold text-slate-800">
        {label} {required && <span className="text-cyan-700">*</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="min-h-12 rounded-lg border border-sume-line/60 bg-white px-4 text-base outline-none transition focus:border-sume-blue focus:bg-white focus:ring-4 focus:ring-sume-blue/10" />
    </div>
  );
}
