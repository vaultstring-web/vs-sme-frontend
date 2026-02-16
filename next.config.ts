import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export – outputs to 'out' directory by default
  output: 'export',

  // Add trailing slashes to all generated paths
  trailingSlash: true,

  // If you use next/image, uncomment the line below to serve images unoptimized
  images: { unoptimized: true },

  // Your existing experimental compiler setting
  reactCompiler: true,

  // Optional: specify a different output directory (default is 'out')
  // distDir: 'out', // (already the default for export)
};

export default nextConfig;