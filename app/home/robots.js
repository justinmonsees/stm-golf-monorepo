export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/checkout",
    },
    sitemap: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/sitemap.xml`,
  };
}
