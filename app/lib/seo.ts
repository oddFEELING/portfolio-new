/**
 * Site-wide SEO config and helpers for meta tags, Open Graph, and JSON-LD.
 */

export const SITE = {
  name: "Emmanuel Alawode",
  shortName: "Emmanuel Alawode",
  url: "https://emmanuelalawode.com",
  title: "Emmanuel Alawode | Full-Stack & AI Software Engineer",
  description:
    "Emmanuel Alawode is a full-stack and AI software engineer based in London. Founding engineer building production AI products, agent systems, and scalable web platforms.",
  /** Default Open Graph / Twitter share image. */
  ogImage: "/Emmanuel_Alawode.webp",
  ogImageAlt:
    "Portrait of Emmanuel Alawode, full-stack and AI software engineer",
  locale: "en_GB",
  themeColor: "#0a0a0a",
  keywords: [
    "Emmanuel Alawode",
    "software engineer",
    "AI engineer",
    "full-stack engineer",
    "AI software engineer London",
    "founding engineer",
    "AI agents",
    "TypeScript",
    "React",
    "Zenning AI",
  ],
  sameAs: [
    "https://github.com/ToniChowBea",
    "https://www.linkedin.com/in/alawodeemmanuel/",
    "https://x.com/emmanuelalawode",
    "https://emmanuelalawode.com",
  ],
  email: "alawodeemmanuel2@gmail.com",
  jobTitle: "Founding AI/Software Engineer",
  location: "London, United Kingdom",
} as const;

/** Public routes included in the sitemap (path + change frequency hints). */
export const SITEMAP_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/experience", priority: "0.9", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "monthly" },
  { path: "/open-source", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
] as const;

export type SitemapEntry = {
  path: string;
  priority?: string;
  changefreq?: string;
  lastmod?: string;
};

type BuildMetaOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: "website" | "profile" | "article";
};

/** Absolute URL for a site path. */
export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized === "/" ? "" : normalized}`;
}

/** Absolute URL for the default (or override) social share image. */
export function absoluteOgImage(image: string = SITE.ogImage) {
  return absoluteUrl(image);
}

/**
 * Build a full meta descriptor list for React Router `meta` exports —
 * title, description, canonical, Open Graph, and Twitter cards.
 */
export function buildMeta({
  title = SITE.title,
  description = SITE.description,
  path = "/",
  image = SITE.ogImage,
  imageAlt = SITE.ogImageAlt,
  noindex = false,
  type = "website",
}: BuildMetaOptions = {}) {
  const url = absoluteUrl(path);
  const ogImage = absoluteOgImage(image);
  const fullTitle = title.includes(SITE.shortName) ? title : `${title} | ${SITE.shortName}`;

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "author", content: SITE.name },
    { name: "keywords", content: SITE.keywords.join(", ") },
    {
      name: "robots",
      content: noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { name: "googlebot", content: noindex ? "noindex, nofollow" : "index, follow" },
    { name: "theme-color", content: SITE.themeColor },
    { tagName: "link" as const, rel: "canonical", href: url },

    // Open Graph
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: SITE.locale },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:image:type", content: "image/webp" },

    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: imageAlt },
    { name: "twitter:creator", content: "@emmanuelalawode" },
  ];
}

/** Person + WebSite JSON-LD for rich results targeting name searches. */
export function buildSiteJsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.name,
    url: SITE.url,
    image: absoluteOgImage(),
    jobTitle: SITE.jobTitle,
    description: SITE.description,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Full-stack software engineering",
      "TypeScript",
      "React",
      "AI agents",
      "Machine learning systems",
    ],
    sameAs: [...SITE.sameAs],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#person` },
    inLanguage: "en-GB",
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE.url}/#profile`,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    mainEntity: { "@id": `${SITE.url}/#person` },
    isPartOf: { "@id": `${SITE.url}/#website` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}

/** XML sitemap body for all public indexable routes. */
export function buildSitemapXml(
  lastmod = new Date().toISOString().slice(0, 10),
  extraEntries: SitemapEntry[] = []
) {
  const staticUrls = SITEMAP_ROUTES.map((route) => ({
    path: route.path,
    priority: route.priority,
    changefreq: route.changefreq,
    lastmod,
  }));

  const urls = [...staticUrls, ...extraEntries]
    .map(
      (route) => `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <lastmod>${route.lastmod ?? lastmod}</lastmod>
    <changefreq>${route.changefreq ?? "monthly"}</changefreq>
    <priority>${route.priority ?? "0.7"}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** robots.txt body pointing crawlers at the sitemap. */
export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
}
