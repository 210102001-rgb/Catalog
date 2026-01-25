import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add empty turbopack config to suppress warning
  turbopack: {},
  // reactCompiler: true,
  // Fix for "stuck" build due to scanning C:\ drive system files
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        // Prevent Webpack from watching system files which causes EPERM/EINVAL errors
        // Use a single RegExp to satisfy Webpack schema (accepts RegExp OR array of globs).
        // The RegExp covers both relative and absolute (Windows root) paths so Watchpack
        // won't attempt lstat on C:\swapfile.sys, C:\hiberfil.sys, etc.
        ignored: /(^|[\\/])(node_modules|\.git|\.next|hiberfil\.sys|swapfile\.sys|pagefile\.sys|DumpStack\.log\.tmp|System Volume Information)([\\/]|$)/i,
      };
    }
    return config;
  },
};

export default nextConfig;
