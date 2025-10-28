/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
 

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_ADDR: process.env.API_ADDR,
    NEXT_PUBLIC_API_PORT: process.env.API_PORT,
    NEXT_PUBLIC_PROXY_PORT: process.env.PROXY_PORT,
    NEXT_PUBLIC_PORT: process.env.PORT,
  },
  output: "standalone",
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
