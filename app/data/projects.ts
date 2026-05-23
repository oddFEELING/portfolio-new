/**
 * Project content.
 *
 * Nubia's metadata and summary are REAL. The Feature Adoption Analyser
 * summary is a PLACEHOLDER — search this file for `PLACEHOLDER` to find the
 * content that must be tailored later.
 */

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  context: string;
  summary: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "nubia",
    name: "Nubia",
    period: "2022",
    context: "Dataphyte",
    summary:
      "An AI platform for African data journalism, built over four years in partnership with Archivi.ng, Daily Trust and Business Day. I designed its technical foundation: a Next.js frontend on an agentic microservice backend, a hosted LLM service, and a provenance-first vector store built around how journalists actually use their sources. The interesting problems sat upstream of generation: messy ingestion, local voice, lean infrastructure and verifiable output.",
    links: [
      {
        label: "LSE Polis write-up",
        href: "https://blogs.lse.ac.uk/polis/2022/10/04/nubia-the-call-the-crawl-and-the-counsels/",
      },
      { label: "nubia.ai", href: "https://nubia.ai/" },
    ],
  },
  {
    slug: "goloka",
    name: "Goloka",
    period: "2024",
    context: "Dataphyte",
    summary:
      "AI-powered market intelligence drawn from a network of on-the-ground citizen contributors, delivering hyperlocal data for businesses, governments and development organisations. The platform has powered work like Meta's multilingual AI training across five Nigerian languages.",
    links: [{ label: "goloka.io", href: "https://www.goloka.io/" }],
  },
  {
    slug: "feature-adoption-analyser",
    name: "Feature Adoption Analyser",
    period: "2025",
    context: "Zenning AI",
    summary:
      "An in-house admin dashboard for monitoring feature adoption across the product, surfacing usage stats and generating automated recommendations for the next actions to lift uptake.",
    links: [{ label: "zenning.ai", href: "https://zenning.ai" }],
  },
  {
    slug: "chowbea",
    name: "Chowbea",
    period: "2025",
    context: "Loyalty SaaS",
    summary:
      "An all-in-one loyalty platform for restaurants, cafés, salons and retail. Customers scan QR codes placed on tables, counters or seats to earn points, stamps, tiered rewards or cashback, with multi-branch role-based access and automated campaigns that track visits and dispatch rewards on autopilot.",
    links: [{ label: "chowbea.com", href: "https://chowbea.com" }],
  },
];
