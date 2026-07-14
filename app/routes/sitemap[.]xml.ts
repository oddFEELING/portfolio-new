import { buildSitemapXml } from "@/lib/seo";

/** Serves /sitemap.xml for search engine discovery. */
export async function loader() {
  const body = buildSitemapXml();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
