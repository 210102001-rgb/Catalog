import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack to resolve build conflicts in Next.js 16.1.3
  turbopack: {
    // Set absolute root directory to avoid confusion with parent directory lockfiles
    root: __dirname,
  },
};

export default nextConfig;