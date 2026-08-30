import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/event-desk/",
          "/event-desk/*",
          "/login",
        ],
      },
    ],
    sitemap: "https://community.botmartz.com/sitemap.xml",
  };
}
