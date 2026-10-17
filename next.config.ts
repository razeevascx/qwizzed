import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      { source: "/app/explorezes/:path*", destination: "/app/quizzes/:path*", permanent: true },
      { source: "/dashboard/explorezes/:path*", destination: "/app/quizzes/:path*", permanent: true },
      { source: "/dashboard/:path*", destination: "/app/:path*", permanent: true },
      { source: "/explorezes/:path*", destination: "/app/quizzes/:path*", permanent: true },
      { source: "/explore/:slug/leaderboard", destination: "/explore/:slug#leaderboard", permanent: true },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
