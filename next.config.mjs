/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", ""),
        port: "", // Leave empty if no custom port
        pathname: "/storage/v1/object/public/**", // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
