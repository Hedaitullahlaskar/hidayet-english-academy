/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise the framework to every request
  images: {
    formats: ["image/avif", "image/webp"],
    // Needed for the avatar upload feature (Settings page) — Supabase
    // Storage serves public files from a per-project *.supabase.co subdomain.
    // Without this, next/image will 400 on any real avatar URL at runtime.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  compress: true,
  async headers() {
    // Baseline security headers, safe to enable unconditionally. A full
    // Content-Security-Policy is deliberately NOT included here — this app
    // legitimately loads scripts/frames from Razorpay's checkout widget,
    // Google/Zoom OAuth flows, and embeds Google Meet/Zoom join links.
    // Getting a CSP allowlist wrong would silently break checkout or live
    // classes, and that risk can only be responsibly verified against a
    // real running deployment, not guessed at here. Recommended as a
    // follow-up once each third-party domain can be tested against.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
