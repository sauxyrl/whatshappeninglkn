"use client";
// ContactForm
// ui-ux-pro-max: ux-guidelines.csv "Input Labels" (Severity High — visible labels, not placeholder-only)
// ui-ux-pro-max: ux-guidelines.csv "Error Messages" (Severity High — role=alert / aria-live for announcements)
// ui-ux-pro-max: ux-guidelines.csv "Input Types" (Severity Medium — type=email, etc)
// DESIGN-SYSTEM.md §6 — labeled inputs, inline Zod errors, no redirect on submit.

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Please include your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  message: z
    .string()
    .min(10, "Your message needs to be at least 10 characters.")
    .max(5000, "Please keep it under 5,000 characters."),
  website: z.string().max(0).optional(),
});

type ContactValues = z.infer<typeof ContactSchema>;

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success"; note?: string }
  | { kind: "error"; message: string };

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(ContactSchema) });
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  async function onSubmit(values: ContactValues) {
    setStatus({ kind: "pending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        note?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(body.error ?? `Something went wrong (${res.status}).`);
      }
      setStatus({ kind: "success", note: body.note });
      reset();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-8 flex flex-col gap-6"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-ink"
        >
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
          className="mt-2 block w-full rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            className="mt-1 text-sm text-error"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-ink"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
          className="mt-2 block w-full rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            className="mt-1 text-sm text-error"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-ink"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message")}
          className="mt-2 block w-full rounded-md border border-rule bg-paper px-3 py-2 text-base leading-relaxed text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1 text-sm text-error"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot — bots fill; humans never touch. */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        {...register("website")}
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || status.kind === "pending"}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status.kind === "pending" ? "Sending…" : "Send"}
        </button>
        {status.kind === "success" && (
          <p role="status" aria-live="polite" className="text-sm text-success">
            Thanks — {status.note ?? "we got it."}
          </p>
        )}
        {status.kind === "error" && (
          <p role="alert" className="text-sm text-error">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
