import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
    },
    sitemap: `${getURL()}sitemap.xml`,
  };
}
