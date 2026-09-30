// The admin panel lives at a secret URL set by NEXT_PUBLIC_ADMIN_PATH (e.g. "studio-x7k2"),
// so it can't be found by guessing /admin. next.config.ts rewrites the secret path to the
// internal /admin routes, and proxy.ts returns 404 for direct /admin requests.
// Without the env var the panel falls back to /admin (local development).
const secret = process.env.NEXT_PUBLIC_ADMIN_PATH?.replace(/^\/+|\/+$/g, "");

export const ADMIN_BASE = `/${secret || "admin"}`;
export const isAdminHidden = Boolean(secret) && secret !== "admin";

export const admin = (path = "") => `${ADMIN_BASE}${path}`;
