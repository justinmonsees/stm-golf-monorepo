/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kqxapincnbnpxxtrfklh.supabase.co",
        port: "", // Leave empty if no custom port
        pathname: "/storage/v1/object/public/**", // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
