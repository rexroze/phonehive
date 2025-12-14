import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
    ],
  },
  // Exclude BA folder from build
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Use webpack for PWA support (next-pwa requires webpack)
  webpack: (config, { isServer }) => {
    // Exclude BA folder from webpack
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/BA/**", "**/node_modules/**"],
    };
    return config;
  },
};

// PWA configuration - only apply in production
let config: NextConfig = nextConfig;

if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: false,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  });
  config = withPWA(nextConfig);
}

export default config;
