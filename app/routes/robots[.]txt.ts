import { buildRobotsTxt } from "@/lib/seo";

/** Serves /robots.txt and points crawlers at the sitemap. */
export async function loader() {
  const body = buildRobotsTxt();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
