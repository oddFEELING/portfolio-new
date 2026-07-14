import { buildSiteJsonLd } from "@/lib/seo";

/**
 * Injects Person / WebSite / ProfilePage JSON-LD for name and profession search.
 */
export function SeoJsonLd() {
  const json = JSON.stringify(buildSiteJsonLd());

  return (
    <script
      // Structured data for crawlers — must be raw JSON-LD in the document.
      dangerouslySetInnerHTML={{ __html: json }}
      type="application/ld+json"
    />
  );
}
