import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  // Fix for "stuck" build due to scanning C:\ drive system files
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        // Prevent Webpack from watching system files which causes EPERM/EINVAL errors
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/.next',
          'C:\\hiberfil.sys',
          'C:\\swapfile.sys',
          'C:\\pagefile.sys',
          'C:\\DumpStack.log.tmp',
          'C:\\System Volume Information',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
