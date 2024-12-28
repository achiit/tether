import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY: process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY,
  },
  turbopack: false
};

export default nextConfig;
