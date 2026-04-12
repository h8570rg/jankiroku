import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils/url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getURL(),
    },
  ];
}
