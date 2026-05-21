"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

const fields: FieldProps[] = [
  {
    label: "FULL NAME",
    name: "name",
    placeholder: "John Doe",
    required: true,
  },
  {
    label: "EMAIL ADDRESS",
    name: "email",
    type: "email",
    placeholder: "john@company.com",
    required: true,
  },
  {
    label: "PHONE NUMBER",
    name: "phone",
    type: "tel",
    placeholder: "+62 ...",
  },
  {
    label: "COMPANY",
    name: "company",
    placeholder: "Your Organization",
  },
];

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
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
          name: getFormValue(formData, "name"),
          email: getFormValue(formData, "email"),
          phone: getFormValue(formData, "phone"),
          company: getFormValue(formData, "company"),
          message: getFormValue(formData, "message"),
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
    <form
      onSubmit={onSubmit}
      className="grid gap-6"
      aria-label="Contact form"
      aria-describedby={statusMessage ? "contact-form-status" : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.name} {...field} />
        ))}
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="form-label">
          MESSAGE
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="form-control p-4"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-full rounded-md bg-sume-blue py-4 text-sm font-bold text-white transition hover:bg-sume-blue-hover disabled:opacity-50"
      >
        {status === "loading"
          ? "Sending..."
          : status === "success"
            ? "Message Sent"
            : "Send Inquiry"}
      </button>

      {statusMessage && (
        <p
          id="contact-form-status"
          className={cn(
            "text-sm font-semibold",
            status === "error" ? "text-red-600" : "text-sume-blue",
          )}
          role="status"
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="form-control h-12 px-4"
      />
    </div>
  );
}
