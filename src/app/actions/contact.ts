"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";

export type ContactState = { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(200),
  intent: z.enum(["hiring", "freelance", "hello"]).default("hello"),
  message: z.string().trim().min(10, "Tell me a little more (10+ characters)").max(5000),
});

async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured yet: rely on honeypot + validation.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function notify(entry: z.infer<typeof schema>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: entry.email,
      subject: `New ${entry.intent} message from ${entry.name}`,
      text: `${entry.message}\n\n— ${entry.name} <${entry.email}>`,
    }),
  }).catch(() => undefined);
}

// Form fields: name, email, intent (hiring|freelance|hello), message,
// website (hidden honeypot, must stay empty), cf-turnstile-response (when Turnstile is on).
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (formData.get("website")) return { ok: true }; // bot filled the honeypot: pretend success

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    intent: formData.get("intent") || undefined,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
    return { ok: false, error: "Spam check failed. Please try again." };
  }

  const { error } = await createServiceClient()
    .from("messages")
    .insert({ ...parsed.data, user_agent: h.get("user-agent")?.slice(0, 300) ?? null });
  if (error) return { ok: false, error: "Something went wrong. Please email me directly." };

  await notify(parsed.data);
  return { ok: true };
}
