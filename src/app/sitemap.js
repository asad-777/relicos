import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap() {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // add other routes here if necessary
  ];
}
