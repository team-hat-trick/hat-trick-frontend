import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "emrxtzgtbgrrrzfrygdf.supabase.co",
      },
      {
        protocol: "https",
        hostname: "crests.football-data.org",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/proxy-api/:path*",
        destination: `https://api.football-data.org/:path*`,
      },
    ];
  },
};

export default nextConfig;
