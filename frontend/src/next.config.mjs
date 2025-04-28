/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
 

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_ADDR: process.env.API_ADDR,
    NEXT_PUBLIC_API_PORT: process.env.API_PORT,
    NEXT_PUBLIC_PORT: process.env.PORT,
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `http://${process.env.API_ADDR}:${process.env.API_PORT}/api/:path*`,
  //     },
  //     {
  //       source: "/resources/:path*",
  //       destination: `http://${process.env.API_ADDR}:${process.env.API_PORT}/resources/:path*`,
  //     },
  //   ];
  // },
  output: "standalone",
};

export default withNextIntl(nextConfig);
