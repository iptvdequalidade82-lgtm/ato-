import type { NextConfig } from "next";

// Export estático: funciona na Vercel, Netlify ou qualquer hospedagem de arquivos.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(process.env.RELATIVE_ASSETS ? { assetPrefix: "./" } : {}),
};

export default config;
