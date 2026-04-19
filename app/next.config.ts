import type { NextConfig } from "next";

// Content Security Policy — TRD §11.
// 'unsafe-inline' on script-src/style-src is the pragmatic choice for a
// Next.js App Router site that doesn't use middleware-based nonces. The app
// ships no user-generated content, so XSS risk is small and this keeps
// hydration + next/font inline styles from breaking.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com https://www.google.com https://maps.google.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
