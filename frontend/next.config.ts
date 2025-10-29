import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Bedre error handling og stabilitet
  reactStrictMode: true,

  // TypeScript - fortsett å kjøre selv ved feil i development
  typescript: {
    // ⚠️ ADVARSEL: Lar Next.js kjøre selv med TypeScript-feil
    // Kun i development - production builds vil fortsatt feile ved type errors
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // Tom turbopack config for å unngå warning (bruker Turbopack defaults)
  turbopack: {},
};

export default nextConfig;
