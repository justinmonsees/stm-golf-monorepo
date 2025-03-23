export default function sitemap() {
  return [
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/sponsors`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/donate`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/register`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
