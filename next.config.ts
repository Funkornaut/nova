/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.REPLIT_ENV === "true"
            ? "http://0.0.0.0:5328/api/:path*"
            : "http://127.0.0.1:5328/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
