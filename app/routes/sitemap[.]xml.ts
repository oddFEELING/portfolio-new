import { buildSitemapXml } from "@/lib/seo";
import { loadQuery } from "@/sanity/loader.server";
import { POST_SLUGS_QUERY, TAG_SLUGS_QUERY } from "@/sanity/queries";

/** Serves /sitemap.xml including published blog posts and tag archives. */
export async function loader() {
  const [{ data: posts }, { data: tags }] = await Promise.all([
    loadQuery<{ slug: string; publishedAt: string }[]>(POST_SLUGS_QUERY, {}),
    loadQuery<{ slug: string }[]>(TAG_SLUGS_QUERY, {}),
  ]);

  const blogEntries =
    posts?.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: post.publishedAt?.slice(0, 10),
    })) ?? [];

  const tagEntries =
    tags?.map((tag) => ({
      path: `/blog/tag/${tag.slug}`,
      priority: "0.6",
      changefreq: "weekly",
    })) ?? [];

  const body = buildSitemapXml(undefined, [...blogEntries, ...tagEntries]);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
