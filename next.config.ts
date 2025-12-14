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
  // Exclude BA folder from Next.js compilation
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Use webpack for PWA support (next-pwa requires webpack)
  webpack: (config, { isServer }) => {
    // Exclude BA folder from webpack compilation
    if (config.module && config.module.rules) {
      // Modify existing rules to exclude BA folder
      config.module.rules.forEach((rule: any) => {
        if (rule.test && (rule.test.toString().includes('tsx?') || rule.test.toString().includes('jsx?'))) {
          if (!rule.exclude) {
            rule.exclude = [];
          }
          if (Array.isArray(rule.exclude)) {
            if (!rule.exclude.some((ex: any) => ex && ex.toString && ex.toString().includes('BA'))) {
              rule.exclude.push(/BA/);
            }
          } else if (typeof rule.exclude === 'function') {
            const originalExclude = rule.exclude;
            rule.exclude = (filePath: string) => {
              if (filePath.includes('BA/')) return true;
              return originalExclude(filePath);
            };
          }
        }
      });
    }
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
