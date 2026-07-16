import { buildSitemapXml } from "@/lib/seo";
import { loadQuery } from "@/sanity/loader.server";
import { POST_SLUGS_QUERY } from "@/sanity/queries";

/** Serves /sitemap.xml including published blog posts. */
export async function loader() {
  const { data: posts } = await loadQuery<{ slug: string; publishedAt: string }[]>(
    POST_SLUGS_QUERY,
    {}
  );

  const blogEntries =
    posts?.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: post.publishedAt?.slice(0, 10),
    })) ?? [];

  const body = buildSitemapXml(undefined, blogEntries);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
