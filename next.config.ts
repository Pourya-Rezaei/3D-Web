import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  experimental: {
    // Tree-shake barrel imports so only the parts of these heavy libraries that
    // are actually used end up in the client bundle.
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
      "postprocessing",
      "framer-motion",
      "gsap",
      "@babylonjs/core",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
