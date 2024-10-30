/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.REPLIT_DB_URL // Check if we're on Replit
            ? "http://0.0.0.0:5328/api/:path*" // Use Replit-compatible URL
            : "http://127.0.0.1:5328/api/:path*", // Local development
      },
    ];
  },
};

module.exports = nextConfig;
