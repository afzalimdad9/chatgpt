import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        hostname: "**"
      }
    ],
  },
  reactStrictMode: true,
  experimental: {
    after: true,
    allowDevelopmentBuild: true,
    middlewarePrefetch: "strict",
    cssChunking: "strict",
    optimisticClientCache: true,
    optimizeCss: true,
    optimizeServerReact: true,
    reactCompiler: true,
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: 'bottom-left'
  },
  rewrites: async () => {
    return [
      {
        destination: "/",
        source: "/chat",
      }
    ]
  }
};

export default nextConfig;
