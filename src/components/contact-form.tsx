"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const fields: FieldProps[] = [
    {
      label: t("fullName"),
      name: "name",
      placeholder: t("fullNamePlaceholder"),
      required: true,
    },
    {
      label: t("email"),
      name: "email",
      type: "email",
      placeholder: t("emailPlaceholder"),
      required: true,
    },
    {
      label: t("phone"),
      name: "phone",
      type: "tel",
      placeholder: t("phonePlaceholder"),
    },
    {
      label: t("company"),
      name: "company",
      placeholder: t("companyPlaceholder"),
    },
  ];

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
        throw new Error(result.message || t("errorFallback"));
      }

      setStatus("success");
      setStatusMessage(result.message || t("sent"));
      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : t("errorFallback"),
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
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="form-control p-4"
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-full rounded-md bg-sume-blue py-4 text-sm font-bold text-white transition hover:bg-sume-blue-hover disabled:opacity-50"
      >
        {status === "loading"
          ? t("sending")
          : status === "success"
            ? t("sent")
            : t("send")}
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
