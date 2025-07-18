import type { NextConfig } from "next";
import pino from "pino";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.vecteezy.com", port: "" },
    ],
  },
};

export default nextConfig;
