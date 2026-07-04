import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack never infers a parent dir (e.g. ~) and
  // ends up watching the entire home tree — that caused dev-server resource crashes.
  turbopack: { root: __dirname },
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ['*.trycloudflare.com'],
};

export default nextConfig;
