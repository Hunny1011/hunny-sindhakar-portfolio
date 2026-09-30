"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CircleAlert, LoaderCircle } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { track } from "@/lib/analytics";

const Celebration = dynamic(() => import("./celebration"), { ssr: false });

const INTENTS = [
  { value: "hiring", label: "Hiring", hint: "A full-time or contract role" },
  { value: "freelance", label: "Freelance project", hint: "An app, site or redesign" },
  { value: "hello", label: "Just saying hi", hint: "Feedback, ideas, a coffee chat" },
] as const;

const PLACEHOLDER: Record<string, string> = {
  hiring: "Tell me about the role, the team and the product…",
  freelance: "What are you building, what’s the timeline and budget range?",
  hello: "Say hello — I read everything.",
};

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm({ firstName }: { firstName: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { ok: false });
  const [intent, setIntent] = useState<string>("hiring");
  // Controlled fields so a failed validation round-trip never wipes what the visitor typed.
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const bind = (name: keyof typeof values) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const fe = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) {
      track("contact_submit", { intent });
      doneRef.current?.focus();
    } else if (state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.ok)
    return (
      <div className="success" ref={doneRef} tabIndex={-1} role="status">
        <span className="relative">
          <span className="success__icon">
            <Check aria-hidden />
          </span>
          <Celebration />
        </span>
        <h2>Message received.</h2>
        <p>
          Thanks for reaching out — {firstName} will get back to you soon, usually within a couple of working days. A copy of your message is
          safely stored.
        </p>
      </div>
    );

  const err = (name: string) =>
    fe[name] ? (
      <p id={`${name}-err`} className="field__err">
        <CircleAlert aria-hidden />
        {fe[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={action} className="form" noValidate>
      {TURNSTILE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}
      <fieldset className="intents">
        <legend>What brings you here?</legend>
        <div className="intents__row">
          {INTENTS.map((o) => (
            <div key={o.value} className="intent">
              <input
                type="radio"
                id={`intent-${o.value}`}
                name="intent"
                value={o.value}
                checked={intent === o.value}
                onChange={() => setIntent(o.value)}
              />
              <label htmlFor={`intent-${o.value}`}>
                <b>{o.label}</b>
                <span>{o.hint}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="form__row">
        <div className="field" data-invalid={!!fe.name}>
          <label htmlFor="name">Your name</label>
          <input id="name" {...bind("name")} autoComplete="name" required minLength={2} aria-invalid={!!fe.name} aria-describedby={fe.name ? "name-err" : undefined} />
          {err("name")}
        </div>
        <div className="field" data-invalid={!!fe.email}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...bind("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={!!fe.email}
            aria-describedby={fe.email ? "email-err" : undefined}
          />
          {err("email")}
        </div>
      </div>

      <div className="field" data-invalid={!!fe.message}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          {...bind("message")}
          required
          minLength={10}
          placeholder={PLACEHOLDER[intent]}
          aria-invalid={!!fe.message}
          aria-describedby={fe.message ? "message-err" : undefined}
        />
        {err("message")}
      </div>

      <div className="hp" aria-hidden>
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {TURNSTILE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-theme="auto" />}

      <div className="form__foot">
        <p className="form__status" role="alert">
          {!state.ok && state.error}
        </p>
        <button type="submit" className="btn btn--honey" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle aria-hidden className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight aria-hidden />
            </>
          )}
        </button>
      </div>
      <p className="form__note">Your details are only used to reply to you.</p>
    </form>
  );
}
