/** @type {import('next').NextConfig} */
const nextConfig = {
  env:{
    NEXT_PUBLIC_API_ADDR: process.env.API_ADDR,
    NEXT_PUBLIC_API_PORT: process.env.API_PORT,
    NEXT_PUBLIC_PORT: process.env.PORT
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_ADDR}/:path*`,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
