import { NextResponse, type NextRequest } from "next/server";

// Hides the internal /admin routes when a secret admin path is configured.
// Proxy runs before next.config rewrites, so it only sees requests typed as /admin directly;
// requests to the secret path are rewritten to /admin afterwards and pass through untouched.
// Authentication itself is enforced by requireAdmin() in every admin page/action and by RLS.
export function proxy(request: NextRequest) {
  const secret = process.env.NEXT_PUBLIC_ADMIN_PATH?.replace(/^\/+|\/+$/g, "");
  if (secret && secret !== "admin") {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
