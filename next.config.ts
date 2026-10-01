import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co").hostname;
const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH?.replace(/^\/+|\/+$/g, "");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  poweredByHeader: false,
  // Serve the admin panel at the secret path (see src/lib/admin/path.ts).
  async rewrites() {
    const hidden = adminPath && adminPath !== "admin";
    return {
      beforeFiles: hidden
        ? [
            { source: `/${adminPath}`, destination: "/admin" },
            { source: `/${adminPath}/:path*`, destination: "/admin/:path*" },
          ]
        : [],
      // Crawlers and old browsers request /favicon.ico directly; serve the generated icon.
      afterFiles: [{ source: "/favicon.ico", destination: "/icon" }],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
